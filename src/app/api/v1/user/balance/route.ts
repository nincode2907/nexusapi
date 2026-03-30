import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    try {
        // 1. Xác thực API Key (Chỉ cho phép Dev/Tool gọi bằng Key)
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer sk-nexus-")) {
            return NextResponse.json(
                { error: { message: "Unauthorized. Missing or invalid API Key.", code: "invalid_api_key" } },
                { status: 401 }
            );
        }

        const rawApiKey = authHeader.replace("Bearer ", "");
        const hashedInputKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        // 2. Tìm User sở hữu Key này (Dùng include để lấy luôn thông tin User trong 1 query)
        const keyRecord = await prisma.apiKey.findUnique({
            where: { hashedKey: hashedInputKey }, // Tìm theo mã Hash, siêu nhanh và bảo mật
            include: {
                user: {
                    select: {
                        totalCredit: true,   // Còn lại
                        totalDeposit: true,  // Tổng nạp (Sếp nhớ add field này vào schema User nhé)
                        totalSpent: true,    // Tổng xài (Sếp nhớ add field này vào schema User nhé)
                    }
                }
            }
        });

        if (!keyRecord || !keyRecord.user) {
            return NextResponse.json(
                { error: { message: "Invalid API Key or User not found.", code: "invalid_api_key" } },
                { status: 401 }
            );
        }

        const user = keyRecord.user;

        // 3. Trả về format chuẩn OpenAI, đổi USD thành CREDIT
        return NextResponse.json({
            object: "billing_balance",
            total_granted: user.totalDeposit || 0,
            total_used: user.totalSpent || 0,
            available_balance: user.totalCredit || 0,
            currency: "CREDIT",
            last_updated: Math.floor(Date.now() / 1000)
        });

    } catch (error) {
        console.error("[API_BALANCE_ERROR]", error);
        return NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
    }
}