import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
 * Extract user ID from bank transfer description.
 * Users are instructed to include "NEXUS <userId>" in the memo.
 * Example: "NEXUS clu8a9bcd0001..." or "Chuyen tien NEXUS clu8a9bcd"
 */
function extractUserIdFromDescription(description: string): string | null {
  if (!description) return null;

  // Case-insensitive match for "NEXUS" followed by a whitespace then the ID
  // The ID is a cuid (alphanumeric, ~25 chars) — capture it greedily
  const match = description.toUpperCase().match(/NEXUS\s*([A-Z0-9]{10,})/i);
  if (!match) return null;

  // Return lowercase (cuids are lowercase)
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
    authHeader?.replace(/^Bearer\s+/i, "").trim() ||
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

  // ── Step 4: Identify user from description ─────
  const userId = extractUserIdFromDescription(description);

  if (!userId) {
    console.error(
      `[Webhook/Bank] ⚠ ORPHANED PAYMENT: Could not extract user ID from description. ` +
        `ref=${bankRefCode} amount=${amountVnd} desc="${description}". ` +
        `Admin must resolve manually.`
    );
    // Return 200 to acknowledge receipt — log for admin resolution
    return NextResponse.json({
      success: true,
      message: "Acknowledged but user not identified. Admin will resolve.",
    });
  }

  // Verify user exists in database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    console.error(
      `[Webhook/Bank] ⚠ ORPHANED PAYMENT: User not found in DB. ` +
        `userId=${userId} ref=${bankRefCode} amount=${amountVnd}. ` +
        `Admin must resolve manually.`
    );
    return NextResponse.json({
      success: true,
      message: "Acknowledged but user not found. Admin will resolve.",
    });
  }

  // ── Step 5: Calculate credits with bonus ───────
  const { baseCredit, bonusRate, finalCredit } = calculateCredits(amountVnd);

  // ── Step 6: Atomic database transaction ────────
  try {
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      // 6a. Create transaction record
      const newTx = await tx.transaction.create({
        data: {
          userId: user.id,
          amountVnd: amountVnd,
          creditAdded: finalCredit,
          type: "TOPUP",
          status: "COMPLETED",
          refCode: bankRefCode,
          metadata: {
            source: "vietqr_webhook",
            description,
            baseCredit,
            bonusRate,
            bonusLabel: bonusRate > 0 ? `+${(bonusRate * 100).toFixed(0)}%` : "none",
            processedAt: new Date().toISOString(),
          },
        },
      });

      // 6b. Increment user's credit balance
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalCredit: { increment: finalCredit },
        },
        select: { totalCredit: true },
      });

      return { transaction: newTx, newBalance: updatedUser.totalCredit };
    });

    console.log(
      `[Webhook/Bank] ✅ TOP-UP SUCCESS: user=${user.id} (${user.email}) ` +
        `amount=${amountVnd.toLocaleString()}đ → ` +
        `base=${baseCredit.toFixed(2)} + bonus=${(bonusRate * 100).toFixed(0)}% = ` +
        `${finalCredit.toFixed(2)} credits. ` +
        `New balance: ${result.newBalance.toFixed(2)} credits. ` +
        `ref=${bankRefCode}`
    );

    return NextResponse.json({
      success: true,
      message: "Credits added successfully",
      data: {
        transactionId: result.transaction.id,
        amountVnd,
        creditAdded: finalCredit,
        bonusRate: `${(bonusRate * 100).toFixed(0)}%`,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[Webhook/Bank] ❌ TRANSACTION FAILED: user=${user.id} ref=${bankRefCode}:`,
      message
    );

    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 500 }
    );
  }
}
