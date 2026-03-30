import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subHours } from "date-fns";

export async function GET(req: Request) {
    // Xác thực request này là từ Vercel Cron gọi (Bảo mật)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const twentyFourHoursAgo = subHours(new Date(), 24);

        const result = await prisma.transaction.updateMany({
            where: {
                status: "PENDING",
                createdAt: { lt: twentyFourHoursAgo },
            },
            data: {
                status: "FAILED",
                metadata: { reason: "Expired after 24 hours" }
            },
        });

        return NextResponse.json({ success: true, canceledCount: result.count });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}