import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // 2. Parse query params
    const { searchParams } = new URL(req.url);
    const daysStr = searchParams.get("days") || "7";
    const days = parseInt(daysStr, 10) || 7;
    const since = subDays(new Date(), days);

    // 3. Fetch all logs for the current user in time range
    const logs = await prisma.usageLog.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        modelName: true,
        promptTokens: true,
        completionTokens: true,
        duration: true,
        statusCode: true,
        totalCostCredit: true,
      },
    });

    // 4. Generate CSV
    const headers = ["ID", "Thời gian", "Model", "Prompt Tokens", "Completion Tokens", "Thời lượng (ms)", "Trạng thái", "Chi phí"];
    const csvRows = logs.map((log) => [
      log.id,
      format(log.createdAt, "dd/MM/yyyy HH:mm:ss"),
      log.modelName,
      log.promptTokens,
      log.completionTokens,
      log.duration || 0,
      log.statusCode,
      Math.round(log.totalCostCredit * 100) / 100,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const filename = `nhat-ky-su-dung-${days}d.csv`;

    // 5. Return as file download
    return new NextResponse(BOM + csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[EXPORT_LOGS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
