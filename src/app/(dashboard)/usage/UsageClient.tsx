"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { subDays, format } from "date-fns";
import { Activity, AlertTriangle, ArrowDownToLine, Clock, Code, Coins, CreditCard, Key, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export type KpiData = {
  totalCost: number;
  totalReqs: number;
  errorReqs: number;
  avgDuration: number;
  totalCacheSaved: number;
};

export type ChartDataPoint = {
  date: string;
  cost: number;
  cache: number;
};

export type DonutDataPoint = {
  name: string;
  value: number;
  fill: string;
};

export type ApiKeyRow = {
  name: string;
  maskedKey: string;
  totalRequests: number;
  totalCost: number;
};

export type UsageLogRow = {
  id: string;
  createdAt: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  duration: number;
  statusCode: number;
  totalCostCredit: number;
};

interface UsageClientProps {
  kpiData: KpiData;
  chartData: ChartDataPoint[];
  donutData: DonutDataPoint[];
  apiKeysData: ApiKeyRow[];
  usageLogs: UsageLogRow[];
  days: number;
  page: number;
  totalLogsCount: number;
}

export default function UsageClient({
  kpiData,
  chartData,
  donutData,
  apiKeysData,
  usageLogs,
  days,
  page,
  totalLogsCount,
}: UsageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleDaysChange = (val: string | null) => {
    if (!val) return;
    startTransition(() => {
      router.push(`?days=${val}&page=1`);
    });
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(`?days=${days}&page=${newPage}`, { scroll: false });
    });
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const response = await fetch(`/api/v1/export-logs?days=${days}`);
      if (!response.ok) throw new Error("Export failed");

      const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
      const endDate = format(new Date(), "yyyy-MM-dd");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexus_api_logs_${startDate}_to_${endDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xuất dữ liệu.");
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
    }
  };

  const totalPages = Math.ceil(totalLogsCount / 10);

  const formatNumber = (num: number) => new Intl.NumberFormat("vi-VN").format(num);
  const formatCurrency = (num: number) => new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê sử dụng API</h2>
        <div className="flex items-center space-x-2">
          <Select value={days.toString()} onValueChange={handleDaysChange} disabled={isPending}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="24 giờ qua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="cursor-pointer">24 giờ qua</SelectItem>
              <SelectItem value="7" className="cursor-pointer">7 ngày qua</SelectItem>
              <SelectItem value="30" className="cursor-pointer">30 ngày qua</SelectItem>
              <SelectItem value="60" className="cursor-pointer">60 ngày qua</SelectItem>
              <SelectItem value="90" className="cursor-pointer">90 ngày qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowExportDialog(true)} variant="outline" className="hidden sm:flex cursor-pointer" disabled={isExporting}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            {isExporting ? "Đang xuất..." : "Xuất CSV"}
          </Button>
        </div>
      </div>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xuất dữ liệu CSV</DialogTitle>
            <DialogDescription>
              Chúng tôi sẽ tạo một tệp CSV chứa toàn bộ nhật ký sử dụng trong <span className="font-bold">{days === 1 ? "24 giờ" : `${days} ngày`}</span> gần nhất để bạn tải xuống. Thời gian xử lý có thể mất vài giây tùy theo lượng dữ liệu.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Bạn muốn bắt đầu xuất dữ liệu ngay bây giờ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)} disabled={isExporting} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleExportCSV} disabled={isExporting} className="cursor-pointer">
              {isExporting ? "Đang xử lý..." : "Xuất"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Chi Phí (Credits)</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.totalCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Số Yêu Cầu</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpiData.totalReqs)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu thất bại</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpiData.errorReqs)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian phản hồi TB</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(kpiData.avgDuration)} ms</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiết kiệm từ cache</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(kpiData.totalCacheSaved)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Chi phí theo ngày</CardTitle>
            <CardDescription>Bao gồm chi phí thực và phần tiết kiệm từ cache.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                cost: { label: "Chi Phí", color: "hsl(var(--primary))" },
                cache: { label: "Tiết Kiệm Cache", color: "hsl(var(--emerald-500))" },
              }}
              className="h-[350px] w-full"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCache" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--emerald-500))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--emerald-500))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `${Math.round(value * 100) / 100} cr`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="cost" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCost)" />
                <Area type="monotone" dataKey="cache" stroke="hsl(var(--emerald-500))" fillOpacity={1} fill="url(#colorCache)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân bổ chi phí theo model</CardTitle>
            <CardDescription>Xem tỷ lệ chi phí sử dụng của từng model AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[350px] w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {donutData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys" className="cursor-pointer">Sử dụng API Key</TabsTrigger>
          <TabsTrigger value="logs" className="cursor-pointer">Nhật ký yêu cầu API</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhật ký yêu cầu API</CardTitle>
              <CardDescription>Theo dõi chi tiết các request được gửi qua proxy, bao gồm model sử dụng, token, thời gian xử lý và chi phí.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Tokens (In/Out)</TableHead>
                      <TableHead>Thời gian phản hồi</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Chi phí (Credits)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">Không tìm thấy nhật ký trong thời gian này.</TableCell>
                      </TableRow>
                    ) : (
                      usageLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.createdAt}</TableCell>
                          <TableCell>{log.modelName}</TableCell>
                          <TableCell>{log.promptTokens} / {log.completionTokens}</TableCell>
                          <TableCell>{log.duration} ms</TableCell>
                          <TableCell>
                            <Badge
                              variant={log.statusCode < 400 ? "outline" : "destructive"}
                              className={log.statusCode < 400 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                            >
                              {log.statusCode < 400 ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {log.statusCode === 200 ? "200 OK" : log.statusCode >= 400 ? `${log.statusCode} Lỗi` : log.statusCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(log.totalCostCredit)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Đang hiển thị {(page - 1) * 10 + 1}-{Math.min(page * 10, totalLogsCount)} / {totalLogsCount}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isPending}
                    className="cursor-pointer"
                  >
                    Trước
                  </Button>
                  <div className="text-sm">Trang {page} / {Math.max(1, totalPages)}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || isPending}
                    className="cursor-pointer"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sử dụng API Key</CardTitle>
              <CardDescription>Thống kê số request và chi phí của từng API key.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên Key</TableHead>
                      <TableHead>Masked Key</TableHead>
                      <TableHead className="text-right">Tổng requests</TableHead>
                      <TableHead className="text-right">Tổng chi phí</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeysData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">Không tìm thấy API key nào.</TableCell>
                      </TableRow>
                    ) : (
                      apiKeysData.map((key, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell><code className="px-2 py-1 bg-muted rounded">{key.maskedKey}</code></TableCell>
                          <TableCell className="text-right">{formatNumber(key.totalRequests)}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(key.totalCost)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
