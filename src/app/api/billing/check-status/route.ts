import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        // 1. Bảo mật: Tránh bị gọi trộm API
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Lấy transactionId từ URL (VD: ?transactionId=cmn...)
        const { searchParams } = new URL(req.url);
        const transactionId = searchParams.get("transactionId");

        if (!transactionId) {
            return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
        }

        // 3. Chọc DB lấy đúng cái status ra
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId,
                userId: session.user.id // Đảm bảo ông nào tạo đơn thì ông đó mới được check
            },
            select: { status: true },
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Trả status về cho Frontend
        return NextResponse.json({ status: transaction.status });
    } catch (error) {
        console.error("[CHECK_STATUS_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}