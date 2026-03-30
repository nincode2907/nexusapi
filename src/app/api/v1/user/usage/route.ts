import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    try {
        // 1. Xác thực API Key
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer sk-nexus-")) {
            return NextResponse.json(
                { error: { message: "Unauthorized. Missing or invalid API Key.", code: "invalid_api_key" } },
                { status: 401 }
            );
        }

        const rawApiKey = authHeader.replace("Bearer ", "");

        // Băm key do Dev gửi lên bằng SHA-256 (Tùy thuộc vào lúc tạo Key sếp băm bằng thuật toán nào thì ở đây dùng thuật toán đó)
        const hashedInputKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        const keyRecord = await prisma.apiKey.findUnique({
            where: { hashedKey: hashedInputKey }, // Tìm theo mã Hash, siêu nhanh và bảo mật
            include: { user: true }
        });

        if (!keyRecord) {
            return NextResponse.json(
                { error: { message: "Invalid API Key", code: "invalid_api_key" } },
                { status: 401 }
            );
        }

        const userId = keyRecord.userId;

        // 2. Lấy & Ép kiểu Query Params (Bảo vệ DB khỏi request quá lớn)
        const { searchParams } = new URL(req.url);

        // Giới hạn max 100 records mỗi lần gọi để bảo vệ RAM và DB
        let limit = parseInt(searchParams.get("limit") || "20", 10);
        if (limit > 100) limit = 100;
        if (limit < 1) limit = 20;

        let page = parseInt(searchParams.get("page") || "1", 10);
        if (page < 1) page = 1;

        // Cho phép lọc theo số ngày (mặc định 30 ngày)
        const days = parseInt(searchParams.get("days") || "30", 10);
        const sinceDate = subDays(new Date(), days);

        // 3. Truy vấn DB song song (Lấy Data + Lấy Tổng số dòng để Dev làm phân trang)
        const [logs, totalCount] = await Promise.all([
            prisma.usageLog.findMany({
                where: {
                    userId: userId,
                    createdAt: { gte: sinceDate }
                },
                orderBy: { createdAt: "desc" }, // Lấy mới nhất trước
                take: limit,
                skip: (page - 1) * limit,
                select: {
                    id: true,
                    createdAt: true,
                    modelName: true,
                    promptTokens: true,
                    completionTokens: true,
                    totalCostCredit: true,
                    duration: true,
                    statusCode: true
                }
            }),
            prisma.usageLog.count({
                where: {
                    userId: userId,
                    createdAt: { gte: sinceDate }
                }
            })
        ]);

        const transformedLogs = logs.map(log => {
            const { modelName, ...rest } = log;
            return {
                ...rest,
                model: modelName,
                totalTokens: log.promptTokens + log.completionTokens,
                totalCostCredit: Number(log.totalCostCredit.toFixed(6))
            };
        });

        // 4. Trả về JSON chuẩn RESTful
        return NextResponse.json({
            object: "list",
            data: transformedLogs,
            pagination: {
                current_page: page,
                limit: limit,
                total_records: totalCount,
                total_pages: Math.ceil(totalCount / limit),
                has_more: page * limit < totalCount
            }
        });

    } catch (error) {
        console.error("[API_USAGE_ERROR]", error);
        return NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
    }
}