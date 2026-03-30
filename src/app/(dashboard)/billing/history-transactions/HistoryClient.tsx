"use client";

import React, { useState, useTransition } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatVND, formatCredits } from "@/lib/utils";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amountVnd: number;
  creditAdded: number;
  type: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

interface HistoryClientProps {
  initialTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
}

export default function HistoryClient({ 
  initialTransactions, 
  currentPage, 
  totalPages,
  totalTransactions 
}: HistoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(`?page=${newPage}`, { scroll: false });
    });
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Đã sao chép mã giao dịch");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="flex items-center gap-1.5 text-emerald-600 font-medium">Thành công <CheckCircle2 className="w-4 h-4" /></span>;
      case "PENDING":
        return <span className="flex items-center gap-1.5 text-amber-600 font-medium">Đang chờ <Clock className="w-4 h-4" /></span>;
      case "FAILED":
        return <span className="flex items-center gap-1.5 text-destructive font-medium">Thất bại <XCircle className="w-4 h-4" /></span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/billing">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lịch sử giao dịch</h1>
            <p className="text-muted-foreground text-sm">Xem lại các lệnh nạp credits của bạn.</p>
          </div>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-4 px-6">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Danh sách giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="w-[200px] font-semibold text-foreground py-4 px-6">Mã GD</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Thời gian</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Số tiền</TableHead>
                  <TableHead className="font-semibold text-foreground py-4">Credit nhận được</TableHead>
                  <TableHead className="font-semibold text-foreground py-4 px-6">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Chưa có giao dịch nào được thực hiện.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors border-border/60">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2 group">
                          <code className="text-xs font-mono bg-muted py-1 px-1.5 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                            {tx.id}
                          </code>
                          <button 
                            onClick={() => handleCopy(tx.id)}
                            className="text-muted-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
                            title="Sao chép mã giao dịch"
                          >
                            {copiedId === tx.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        {format(new Date(tx.createdAt), "HH:mm dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-zinc-400">
                        {formatVND(tx.amountVnd)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCredits(tx.creditAdded)} Cr
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm">
                        {getStatusIcon(tx.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border/60 bg-muted/5">
            <div className="text-sm text-muted-foreground">
              Đang hiển thị {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalTransactions)} / {totalTransactions}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
                className="cursor-pointer"
              >
                Trước
              </Button>
              <div className="text-sm px-2">Trang {currentPage} / {Math.max(1, totalPages)}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
                className="cursor-pointer"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Lịch sử giao dịch được cập nhật tự động theo thời gian thực.
        </p>
      </div>
    </div>
  );
}
