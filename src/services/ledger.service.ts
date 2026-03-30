import prisma from "@/lib/prisma";
import { LedgerType } from "@prisma/client";

// ─────────────────────────────────────────────
// Ledger Service (Sổ Cái Kế Toán Kép)
// Trung tâm xử lý mọi thay đổi số dư Credit.
// Mọi dòng tiền đều PHẢI đi qua đây để đảm bảo
// tính toàn vẹn và khả năng kiểm toán (audit trail).
// ─────────────────────────────────────────────

// Prisma Transaction Client type — dùng để nhận tx từ bên ngoài
type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

export interface UpdateCreditResult {
  success: boolean;
  newBalance: number;
  ledgerId: string;
  error?: string;
}

/**
 * Cập nhật số dư Credit của User và ghi sổ cái (CreditLedger).
 *
 * ĐẶC ĐIỂM QUAN TRỌNG:
 * - Nếu `tx` được truyền vào: sử dụng transaction context bên ngoài (KHÔNG tạo nested transaction).
 * - Nếu `tx` không được truyền: tự tạo $transaction mới để đảm bảo atomic.
 *
 * LUỒNG XỬ LÝ:
 * 1. Cập nhật totalCredit của User (increment = amount, có thể âm nếu trừ tiền)
 * 2. Cập nhật totalDeposit (nếu DEPOSIT/PROMO) hoặc totalSpent (nếu USAGE)
 * 3. Lấy số dư mới (balanceAfter)
 * 4. Tạo record CreditLedger với đầy đủ thông tin kiểm toán
 *
 * @param userId        - ID của user cần cập nhật
 * @param amount        - Số credit thay đổi (+ cộng, - trừ)
 * @param type          - Loại giao dịch: DEPOSIT, USAGE, PROMO, REFUND, SYSTEM
 * @param description   - Mô tả giao dịch (VD: "Nạp tiền VietQR", "Gọi GPT-4o")
 * @param referenceId   - ID liên kết (Transaction ID, UsageLog ID, GiftCode ID...)
 * @param tx            - Prisma Transaction Client (nếu đang trong transaction lớn)
 */
export async function updateUserCredit(
  userId: string,
  amount: number,
  type: LedgerType,
  description: string,
  referenceId?: string,
  tx?: TransactionClient
): Promise<UpdateCreditResult> {
  // Logic chính — sẽ chạy trong transaction context
  const execute = async (client: TransactionClient): Promise<UpdateCreditResult> => {
    // 1. Tính toán các trường tổng hợp cần cập nhật
    const updateData: Record<string, unknown> = {
      totalCredit: { increment: amount },
    };

    // Cộng vào totalDeposit nếu là tiền vào (DEPOSIT, PROMO, REFUND)
    if (amount > 0 && (type === "DEPOSIT" || type === "PROMO" || type === "REFUND" || type === "SYSTEM")) {
      updateData.totalDeposit = { increment: amount };
    }

    // Cộng vào totalSpent nếu là tiền ra (USAGE)
    if (amount < 0 && type === "USAGE") {
      updateData.totalSpent = { increment: Math.abs(amount) };
    }

    // 2. Cập nhật số dư User
    const updatedUser = await client.user.update({
      where: { id: userId },
      data: updateData,
      select: { totalCredit: true },
    });

    const newBalance = updatedUser.totalCredit;

    // 3. Ghi sổ cái (CreditLedger)
    const ledgerEntry = await client.creditLedger.create({
      data: {
        userId,
        amount,
        balanceAfter: newBalance,
        type,
        description,
        referenceId: referenceId ?? null,
      },
    });

    // 4. Cảnh báo nếu số dư âm
    if (newBalance < 0) {
      console.warn(
        `[Ledger] ⚠ User ${userId} balance went negative: ${newBalance.toFixed(6)}. ` +
        `Type: ${type}, Amount: ${amount}, Ref: ${referenceId || "N/A"}`
      );
    }

    return {
      success: true,
      newBalance,
      ledgerId: ledgerEntry.id,
    };
  };

  try {
    // Nếu đã có transaction context từ bên ngoài → chạy trực tiếp (KHÔNG nested)
    if (tx) {
      return await execute(tx);
    }

    // Nếu không có → tự tạo transaction mới
    return await prisma.$transaction(async (newTx) => {
      return await execute(newTx);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ledger error";
    console.error(
      `[Ledger] ❌ FAILED: user=${userId} type=${type} amount=${amount}:`, message
    );
    return {
      success: false,
      newBalance: 0,
      ledgerId: "",
      error: message,
    };
  }
}
