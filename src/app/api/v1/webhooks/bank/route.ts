import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateUserCredit } from "@/services/ledger.service";

// ─────────────────────────────────────────────
// POST /api/v1/webhooks/bank
// VietQR Bank Transfer Webhook (SePay / Casso)
// Automatically top-up user credits on transfer
// ─────────────────────────────────────────────

// Transaction client type
type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

// ── Constants ────────────────────────────────
const VND_PER_CREDIT = 25;

// Bonus tiers — ordered from highest to lowest
const BONUS_TIERS = [
  { minAmount: 2_000_000, bonusRate: 0.20, label: "20%" },
  { minAmount: 500_000, bonusRate: 0.10, label: "10%" },
  { minAmount: 200_000, bonusRate: 0.05, label: "5%" },
] as const;

/**
 * Calculate credits with bonus tier applied.
 */
function calculateCredits(amountVnd: number): {
  baseCredit: number;
  bonusRate: number;
  finalCredit: number;
} {
  const baseCredit = amountVnd / VND_PER_CREDIT;

  // Find the highest matching tier
  const tier = BONUS_TIERS.find((t) => amountVnd >= t.minAmount);
  const bonusRate = tier?.bonusRate ?? 0;

  const finalCredit = baseCredit * (1 + bonusRate);

  return { baseCredit, bonusRate, finalCredit };
}

/**
 * Extract an ID (Transaction ID or User ID) from bank transfer description.
 * Users are instructed to include "NEXUS [ID]" in the memo.
 */
function extractIdFromDescription(description: string): string | null {
  if (!description) return null;

  // Case-insensitive match for "NEXUS" followed by a whitespace then the ID
  // Captures alphanumeric IDs of length 10 or more (cuid, etc.)
  const match = description.toUpperCase().match(/NEXUS\s*([A-Z0-9]{10,})/i);
  if (!match) return null;

  return match[1].toLowerCase();
}

// ─────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // ── Step 1: Verify webhook secret ──────────────
  const webhookSecret = process.env.BANK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Webhook/Bank] BANK_WEBHOOK_SECRET is not configured!");
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // Support both Bearer token and custom header
  const authHeader = request.headers.get("authorization");
  const customHeader = request.headers.get("x-webhook-secret");
  const providedSecret =
    authHeader?.replace(/^(Bearer|Apikey)\s+/i, "").trim() ||
    customHeader?.trim();

  if (providedSecret !== webhookSecret) {
    console.warn("[Webhook/Bank] Invalid webhook secret received");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ── Step 2: Parse payload ──────────────────────
  let payload: {
    amount?: number;
    description?: string;
    transactionId?: string;
    // Also support common field aliases from SePay/Casso
    transferAmount?: number;
    content?: string;
    referenceCode?: string;
    id?: string;
  };

  try {
    payload = await request.json();
  } catch {
    console.error("[Webhook/Bank] Failed to parse JSON body");
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Normalize field names (SePay vs Casso vs custom)
  const amountVnd = payload.amount || payload.transferAmount || 0;
  const description = payload.description || payload.content || "";
  const bankRefCode = payload.transactionId || payload.referenceCode || payload.id || "";

  // Validation
  if (amountVnd <= 0) {
    console.warn("[Webhook/Bank] Received webhook with zero/negative amount:", amountVnd);
    // Return 200 to acknowledge — don't make provider retry
    return NextResponse.json({ success: true, message: "Ignored: zero amount" });
  }

  if (!bankRefCode) {
    console.error("[Webhook/Bank] Missing transactionId/referenceCode in payload");
    return NextResponse.json({ success: true, message: "Ignored: no reference code" });
  }

  console.log(
    `[Webhook/Bank] Received: amount=${amountVnd} ref=${bankRefCode} desc="${description}"`
  );

  // ── Step 3: Idempotency check ──────────────────
  const existingTx = await prisma.transaction.findFirst({
    where: { refCode: bankRefCode },
  });

  if (existingTx) {
    console.warn(
      `[Webhook/Bank] Duplicate transaction detected: ref=${bankRefCode}. ` +
      `Already processed for user=${existingTx.userId}. Skipping.`
    );
    return NextResponse.json({
      success: true,
      message: "Already processed",
      transactionId: existingTx.id,
    });
  }

  // ── Step 4: Identify Transaction or User from description ─────
  const extractedId = extractIdFromDescription(description);

  if (!extractedId) {
    console.error(
      `[Webhook/Bank] ⚠ ORPHANED PAYMENT: Could not extract ID from description. ` +
      `ref=${bankRefCode} amount=${amountVnd} desc="${description}".`
    );
    return NextResponse.json({ success: true, message: "ID not found in description" });
  }

  // 4a. Check if it's a Transaction ID
  let targetTransaction = await prisma.transaction.findUnique({
    where: { id: extractedId },
    include: { user: true },
  });

  // 🚨 VÁ LỖ HỔNG 2: Nếu hóa đơn này đã THANH TOÁN rồi (khách chuyển nhồi vào mã cũ)
  // -> Ta hủy bỏ targetTransaction để ép hệ thống rơi xuống Step 4b (Tạo hóa đơn mới)
  if (targetTransaction && targetTransaction.status !== "PENDING") {
    console.warn(`[Webhook/Bank] Tx ${extractedId} already completed. Treating as generic top-up.`);
    targetTransaction = null;
  }

  let targetUser = targetTransaction?.user || null;
  let creditToAdd = targetTransaction?.creditAdded || 0;

  // 🚨 VÁ LỖ HỔNG 1: Chống nạp thiếu tiền (Underpayment check)
  if (targetTransaction && amountVnd !== targetTransaction.amountVnd) {
    console.warn(
      `[Webhook/Bank] ⚠ SAI LỆCH TIỀN: Khách tạo đơn ${targetTransaction.amountVnd}đ nhưng chuyển ${amountVnd}đ. ` +
      `Sẽ tự động tính lại Credit theo số tiền thực tế nhận được.`
    );
    // Tính lại Credit dựa trên số tiền thật sự ngân hàng báo về
    const { finalCredit } = calculateCredits(amountVnd);
    creditToAdd = finalCredit;
  }

  // 4b. Fallback: Check if it's a User ID (Trường hợp khách tự chuyển không tạo đơn trước)
  if (!targetTransaction) {
    targetUser = await prisma.user.findUnique({
      where: { id: extractedId },
    });

    if (targetUser) {
      const { finalCredit } = calculateCredits(amountVnd);
      creditToAdd = finalCredit;
    }
  }

  if (!targetUser) {
    console.error(
      `[Webhook/Bank] ⚠ ORPHANED PAYMENT: No matching user or transaction found for ID: ${extractedId}. ` +
      `ref=${bankRefCode} amount=${amountVnd}.`
    );
    return NextResponse.json({ success: true, message: "User/Transaction not found" });
  }

  const { baseCredit, bonusRate } = calculateCredits(amountVnd);

  // ── Step 5: Atomic database transaction ────────
  try {
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      let finalTx;

      // 5a. Update existing or create NEW transaction record
      if (targetTransaction) {
        finalTx = await tx.transaction.update({
          where: { id: targetTransaction.id },
          data: {
            status: "COMPLETED",
            refCode: bankRefCode,
            amountVnd: amountVnd,         // Cập nhật lại số tiền thật đã nhận (nếu khách lươn lẹo nạp thiếu)
            creditAdded: creditToAdd,     // Cập nhật lại số Credit thật đã cộng
            metadata: {
              ...(typeof targetTransaction.metadata === 'object' && targetTransaction.metadata !== null ? targetTransaction.metadata : {}),
              webhook_processed_at: new Date().toISOString(),
              bank_ref: bankRefCode,
              original_order_amount: targetTransaction.amountVnd // Lưu lại dấu vết khách nạp thiếu
            }
          }
        });
      } else {
        finalTx = await tx.transaction.create({
          data: {
            userId: targetUser!.id,
            amountVnd: amountVnd,
            creditAdded: creditToAdd,
            type: "TOPUP",
            status: "COMPLETED",
            refCode: bankRefCode,
            metadata: {
              source: "vietqr_webhook_fallback",
              description,
              baseCredit,
              bonusRate,
              processedAt: new Date().toISOString(),
            },
          },
        });
      }

      // 5b. Ghi sổ cái + cộng credit (qua Ledger Service)
      const ledgerResult = await updateUserCredit(
        targetUser!.id,
        creditToAdd,
        "DEPOSIT",
        `Nạp tiền tự động qua VietQR — ${amountVnd.toLocaleString()}đ (ref: ${bankRefCode})`,
        finalTx.id,
        tx  // Truyền transaction context để tránh nested transaction
      );

      return { transaction: finalTx, newBalance: ledgerResult.newBalance };
    });

    console.log(
      `[Webhook/Bank] ✅ TOP-UP SUCCESS: user=${targetUser.id} (${targetUser.email}) ` +
      `amount=${amountVnd.toLocaleString()}đ → creditAdded=${creditToAdd.toFixed(2)}. ` +
      `New balance: ${result.newBalance.toFixed(2)}. ref=${bankRefCode}`
    );

    return NextResponse.json({
      success: true,
      message: "Credits added successfully",
      data: {
        transactionId: result.transaction.id,
        amountVnd,
        creditAdded: creditToAdd,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[Webhook/Bank] ❌ TRANSACTION FAILED: user=${targetUser!.id} ref=${bankRefCode}:`,
      message
    );

    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 500 }
    );
  }
}