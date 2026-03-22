import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingDown,
  Zap,
  Key,
  LogOut,
  Cpu,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import CacheGauge from "./CacheGauge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  const userId = session.user.id;

  const [user, topModels, usageStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        apiKeys: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 3
        },
      },
    }),
    prisma.usageLog.groupBy({
      by: ["modelName"],
      where: { apiKey: { userId } },
      _sum: { totalCostCredit: true, promptTokens: true, completionTokens: true },
      orderBy: { _sum: { totalCostCredit: "desc" } },
      take: 3,
    }),
    prisma.usageLog.aggregate({
      where: { apiKey: { userId } },
      _sum: { promptTokens: true, cachedTokens: true, creditSaved: true },
      _count: { id: true }
    })
  ]);

  if (!user) redirect("/api/auth/signin");

  const totalInputTokens = usageStats._sum?.promptTokens || 0;
  const cachedTokens = usageStats._sum?.cachedTokens || 0;
  const totalRequests = usageStats._count?.id || 0;
  const totalSaved = usageStats._sum?.creditSaved || 0;
  const cacheHitRate = totalInputTokens > 0 ? (cachedTokens / totalInputTokens) * 100 : 0;
  const inputSavingsPercent = 95;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Tổng quan</h1>
        <p className="text-muted-foreground text-sm">Theo dõi chi phí, hiệu suất cache và quản lý API keys.</p>
      </div>

      {user.totalCredit < 0 && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex items-start gap-3 shadow-sm dark:bg-amber-500/10 dark:border-amber-500/20">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Đã kích hoạt Tạm Ứng</h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1">
              Hệ thống đã ứng trước {Math.abs(Math.floor(user.totalCredit)).toLocaleString("vi-VN")} credits để request cuối cùng của bạn không bị đứt đoạn. Hãy nạp thêm để tiếp tục sử dụng API không gián đoạn.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold text-emerald-800 dark:text-emerald-400">Cache Hit Rate</CardTitle>
              <p className="text-xs text-muted-foreground">Prompt Caching Performance</p>
            </div>
            <Zap className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative flex flex-col items-center pb-2">
            <CacheGauge hitRate={cacheHitRate} />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-foreground/90">
                {formatNumber(cachedTokens)} / {formatNumber(totalInputTokens)} Input Tokens
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Được phục vụ từ Memory Cache trong tổng số {totalRequests} requests
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/60 shadow-sm bg-background flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Credits Đã Tiết Kiệm</CardTitle>
              <p className="text-xs text-muted-foreground">Nhờ vào Prompt Caching</p>
            </div>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {totalSaved.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} credits
            </div>
            <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-2">
              Lượng chi phí được giữ lại hoàn toàn tự động nhờ cơ chế Prompt Caching.
            </p>
            <div className="mt-7 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>Input Caching Discount:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20">giảm {inputSavingsPercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="rounded-xl border-border/60 shadow-sm bg-background flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Top Models</CardTitle>
            </div>
            <Cpu className="w-4 h-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <div className="space-y-4">
              {topModels.length === 0 ? (
                <div className="text-sm text-center py-4 text-muted-foreground">No model usage yet.</div>
              ) : (
                topModels.map((m: any) => (
                  <div key={m.modelName} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{m.modelName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatNumber((m._sum.promptTokens || 0) + (m._sum.completionTokens || 0))} tokens
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="rounded-xl border-border/60 shadow-sm bg-background flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Active API Keys</CardTitle>
            </div>
            <Key className="w-4 h-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent className="flex-1 pt-4 flex flex-col">
            <div className="space-y-2 mb-4">
              {user.apiKeys.length === 0 ? (
                <div className="text-sm text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                  No active keys found.
                </div>
              ) : (
                user.apiKeys.map((k: { id: string; name: string | null; maskedKey: string }) => (
                  <div key={k.id} className="flex justify-between items-center p-3 rounded-md bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">{k.name || "Untitled"}</span>
                    <span className="text-xs font-mono text-muted-foreground">{k.maskedKey}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-auto flex justify-end">
              <Link href="/api-keys">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground pr-0">
                  View all API keys <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
