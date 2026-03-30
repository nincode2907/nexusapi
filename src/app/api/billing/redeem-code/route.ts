import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateUserCredit } from "@/services/ledger.service";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
        }

        const { code } = await req.json();
        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "Mã không hợp lệ" }, { status: 400 });
        }

        const normalizedCode = code.trim().toUpperCase();

        // 1. Tìm mã trong hệ thống
        const giftCode = await prisma.giftCode.findUnique({
            where: { code: normalizedCode },
        });

        // 2. Kiểm tra các điều kiện (Lớp bảo vệ 2)
        if (!giftCode) return NextResponse.json({ error: "Mã không tồn tại" }, { status: 404 });
        if (!giftCode.isActive) return NextResponse.json({ error: "Mã đã bị khóa" }, { status: 400 });
        if (giftCode.usedCount >= giftCode.maxUses) return NextResponse.json({ error: "Mã đã hết lượt sử dụng" }, { status: 400 });
        if (giftCode.expiresAt && new Date() > giftCode.expiresAt) return NextResponse.json({ error: "Mã đã hết hạn" }, { status: 400 });

        // 3. Kiểm tra xem ông nội này đã xài mã này chưa
        const alreadyUsed = await prisma.userGiftCode.findUnique({
            where: {
                userId_giftCodeId: {
                    userId: session.user.id,
                    giftCodeId: giftCode.id,
                },
            },
        });

        if (alreadyUsed) {
            return NextResponse.json({ error: "Mã đã được sử dụng" }, { status: 400 });
        }

        // 4. CHẠY TRANSACTION ATOMIC (Lớp bảo vệ 3 - Chống Race Condition)
        const result = await prisma.$transaction(async (tx) => {
            // 4a. Cố gắng tăng số lượt dùng lên 1. Nếu hết lượt, truy vấn này sẽ thất bại
            const updatedGiftCode = await tx.giftCode.update({
                where: {
                    id: giftCode.id,
                    usedCount: { lt: giftCode.maxUses } // CHỐNG SPAM 3: Đảm bảo chưa quá giới hạn
                },
                data: { usedCount: { increment: 1 } },
            });

            // 4b. Ghi vào sổ Nam Tào
            await tx.userGiftCode.create({
                data: {
                    userId: session.user.id,
                    giftCodeId: giftCode.id,
                },
            });

            // 4c. Tạo 1 hóa đơn loại GIFT (Để hiển thị trong Lịch sử giao dịch)
            const transaction = await tx.transaction.create({
                data: {
                    userId: session.user.id,
                    amountVnd: 0,
                    creditAdded: updatedGiftCode.creditReward,
                    type: "GIFT",
                    status: "COMPLETED",
                    metadata: {
                        source: "gift_code",
                        code: normalizedCode,
                        redeemedAt: new Date().toISOString(),
                    },
                },
            });

            // 4d. Cộng tiền qua Ledger Service (ghi sổ cái kế toán kép)
            const ledgerResult = await updateUserCredit(
                session.user.id,
                updatedGiftCode.creditReward,
                "PROMO",
                `Nhập mã quà tặng ${normalizedCode} — +${updatedGiftCode.creditReward} credits`,
                giftCode.id,  // referenceId = GiftCode ID
                tx  // Truyền transaction context
            );

            return { creditAdded: updatedGiftCode.creditReward, newBalance: ledgerResult.newBalance };
        });

        return NextResponse.json({
            success: true,
            message: `Đổi mã thành công! Bạn nhận được +${result.creditAdded} Credit`,
            newBalance: result.newBalance,
        });

    } catch (error: any) {
        console.error("[REDEEM_CODE_ERROR]", error);
        // Bắt lỗi Unique Constraint nếu hacker spam 2 request cùng lúc cho cùng 1 user
        if (error.code === 'P2002' || error.code === 'P2025') {
            return NextResponse.json({ error: "Thao tác không hợp lệ hoặc mã đã hết lượt" }, { status: 400 });
        }
        return NextResponse.json({ error: "Lỗi hệ thống khi đổi mã" }, { status: 500 });
    }
}