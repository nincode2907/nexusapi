import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { subDays, format } from "date-fns";
import { Prisma } from "@prisma/client";

import UsageClient, {
  type KpiData,
  type ChartDataPoint,
  type DonutDataPoint,
  type ApiKeyRow,
  type UsageLogRow,
} from "./UsageClient";

// ─────────────────────────────────────────────────────────────────────────────
// Donut color palette
// ─────────────────────────────────────────────────────────────────────────────
const DONUT_COLORS = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#06b6d4", // cyan
  "#e11d48", // rose
];

// ─────────────────────────────────────────────────────────────────────────────
// Allowed day values
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_DAYS = new Set([1, 7, 30, 60, 90]);

function parseDays(raw: string | string[] | undefined): number {
  const n = Number(raw);
  return ALLOWED_DAYS.has(n) ? n : 1;
}

function parsePage(raw: string | string[] | undefined): number {
  const n = Number(raw);
  return n > 0 ? n : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Server Component
// ─────────────────────────────────────────────────────────────────────────────

export default async function UsagePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  const userId = session.user.id;

  // 2. Parse searchParams (Next.js 16: async)
  const resolvedParams = await searchParams;
  const days = parseDays(resolvedParams.days);
  const page = parsePage(resolvedParams.page);
  const since = subDays(new Date(), days);

  const is24h = days === 1;

  // 3. Fetch all data in parallel
  const [
    kpiAgg,
    errorCount,
    dailyRaw,
    modelBreakdown,
    apiKeys,
    apiKeyStats,
    rawLogs,
    totalLogsCount,
  ] = await Promise.all([
    // KPI Aggregation
    prisma.usageLog.aggregate({
      where: { userId, createdAt: { gte: since } },
      _sum: { totalCostCredit: true, creditSaved: true },
      _avg: { duration: true },
      _count: { id: true },
    }),

    // Error count (statusCode >= 400)
    prisma.usageLog.count({
      where: { userId, createdAt: { gte: since }, statusCode: { gte: 400 } },
    }),

    // Daily chart data via raw SQL (PostgreSQL DATE() truncation)
    prisma.$queryRaw<Array<{ date: Date; cost: number; cache: number }>>(
      is24h
        ? Prisma.sql`
            SELECT
              DATE_TRUNC('hour', "created_at") AS "date",
              COALESCE(SUM("total_cost_credit"), 0)::float AS "cost",
              COALESCE(SUM("credit_saved"), 0)::float AS "cache"
            FROM "usage_logs"
            WHERE "user_id" = ${userId}
              AND "created_at" >= ${since}
            GROUP BY DATE_TRUNC('hour', "created_at")
            ORDER BY "date" ASC
          `
        : Prisma.sql`
            SELECT
              DATE("created_at") AS "date",
              COALESCE(SUM("total_cost_credit"), 0)::float AS "cost",
              COALESCE(SUM("credit_saved"), 0)::float AS "cache"
            FROM "usage_logs"
            WHERE "user_id" = ${userId}
              AND "created_at" >= ${since}
            GROUP BY DATE("created_at")
            ORDER BY "date" ASC
          `
    ),

    // Model breakdown for donut chart
    prisma.usageLog.groupBy({
      by: ["modelName"],
      where: { userId, createdAt: { gte: since } },
      _sum: { totalCostCredit: true },
      orderBy: { _sum: { totalCostCredit: "desc" } },
      take: 8,
    }),

    // API Keys (basic info)
    prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, maskedKey: true },
      orderBy: { createdAt: "desc" },
    }),

    // API Key usage stats (grouped by apiKeyId within time range)
    prisma.usageLog.groupBy({
      by: ["apiKeyId"],
      where: { userId, createdAt: { gte: since } },
      _sum: { totalCostCredit: true },
      _count: { id: true },
    }),

    // Paginated usage logs (10 per page)
    prisma.usageLog.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 10,
      take: 10,
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
    }),

    // Total logs in this time range for pagination metadata
    prisma.usageLog.count({
      where: { userId, createdAt: { gte: since } },
    }),
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Transform data into serializable shapes for the client
  // ─────────────────────────────────────────────────────────────────────────

  // KPI
  const kpiData: KpiData = {
    totalCost: Math.round((kpiAgg._sum.totalCostCredit ?? 0) * 100) / 100,
    totalReqs: kpiAgg._count.id ?? 0,
    errorReqs: errorCount,
    avgDuration: kpiAgg._avg.duration ?? 0,
    totalCacheSaved: Math.round((kpiAgg._sum.creditSaved ?? 0) * 100) / 100,
  };

  // Chart (daily)
  const chartData: ChartDataPoint[] = dailyRaw.map((row) => ({
    date: is24h ? format(new Date(row.date), "HH:mm") : format(new Date(row.date), "dd/MM"),
    cost: Math.round(row.cost * 100) / 100,
    cache: Math.round(row.cache * 100) / 100,
  }));

  // Donut (model breakdown)
  const rawDonutData = modelBreakdown.map((m) => ({
    name: m.modelName,
    value: Math.round((m._sum.totalCostCredit ?? 0) * 100) / 100,
  })).sort((a, b) => b.value - a.value);

  let finalDonutData = [];
  if (rawDonutData.length > 3) {
    const top3 = rawDonutData.slice(0, 3);
    const othersValue = rawDonutData.slice(3).reduce((acc, curr) => acc + curr.value, 0);
    finalDonutData = [...top3, { name: "models khác", value: Math.round(othersValue * 100) / 100 }];
  } else {
    finalDonutData = [...rawDonutData];
  }

  const donutData: DonutDataPoint[] = finalDonutData.map((d, i) => ({
    ...d,
    fill: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  // API Keys (join keys metadata + usage stats)
  const statsMap = new Map(
    apiKeyStats.map((s) => [
      s.apiKeyId,
      {
        totalRequests: s._count.id,
        totalCost: s._sum.totalCostCredit ?? 0,
      },
    ])
  );

  const apiKeysData: ApiKeyRow[] = apiKeys.map((key) => {
    const stats = statsMap.get(key.id);
    return {
      name: key.name || "Untitled",
      maskedKey: key.maskedKey,
      totalRequests: stats?.totalRequests ?? 0,
      totalCost: Math.round((stats?.totalCost ?? 0) * 100) / 100,
    };
  });

  // Usage logs
  const usageLogs: UsageLogRow[] = rawLogs.map((log) => ({
    id: log.id,
    createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm:ss"),
    modelName: log.modelName,
    promptTokens: log.promptTokens,
    completionTokens: log.completionTokens,
    duration: log.duration ?? 0,
    statusCode: log.statusCode,
    totalCostCredit: log.totalCostCredit,
  }));

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <UsageClient
      kpiData={kpiData}
      chartData={chartData}
      donutData={donutData}
      apiKeysData={apiKeysData}
      usageLogs={usageLogs}
      days={days}
      page={page}
      totalLogsCount={totalLogsCount}
    />
  );
}
