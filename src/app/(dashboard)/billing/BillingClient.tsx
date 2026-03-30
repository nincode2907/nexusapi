"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatVND, formatCredits, calculateSavings } from "@/lib/utils";
import { CreditCard, Wallet, AlertTriangle, ShieldCheck, Zap, CheckCircle2, XCircle, Clock, LifeBuoy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TopupPackage {
  id: string;
  name: string;
  priceVnd: number;
  creditAmnt: number;
  bonusCredit: number;
  isActive: boolean;
}

interface BillingClientProps {
  initialCredit: number;
  packages: TopupPackage[];
}

export default function BillingClient({ initialCredit, packages, bankConfig }: BillingClientProps) {
  const router = useRouter();
  const [loadingPkgId, setLoadingPkgId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    amountVnd: number;
    transactionId: string;
  } | null>(null);
  const [pollingStatus, setPollingStatus] = useState<"PENDING" | "COMPLETED" | "FAILED" | "TIMEOUT">("PENDING");
  const [checkCountdown, setCheckCountdown] = useState(5);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  const [displayCredit, setDisplayCredit] = useState(initialCredit);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = React.useRef(initialCredit);

  useEffect(() => {
    if (initialCredit === prevValueRef.current) return;

    setIsAnimating(true);
    const startValue = displayCredit;
    const endValue = initialCredit;
    const duration = 1000;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animateValue = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;

      setDisplayCredit(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateValue);
      } else {
        setTimeout(() => setIsAnimating(false), 500);
        prevValueRef.current = initialCredit;
      }
    };

    animationFrameId = requestAnimationFrame(animateValue);
    return () => cancelAnimationFrame(animationFrameId);
  }, [initialCredit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (selectedOrder && pollingStatus === "PENDING") {
      interval = setInterval(() => {
        setTotalElapsedSeconds((prev) => {
          // Ngừng tự động kiểm tra sau 15 phút (900 giây)
          if (prev >= 900) {
            setPollingStatus("TIMEOUT");
            return prev;
          }
          return prev + 1;
        });

        setCheckCountdown((prev) => {
          if (prev <= 1) {
            checkTransactionStatus(selectedOrder.transactionId);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [selectedOrder, pollingStatus]);

  useEffect(() => {
    if (!selectedOrder) {
      setPollingStatus("PENDING");
      setCheckCountdown(5);
      setTotalElapsedSeconds(0);
    }
  }, [selectedOrder]);

  const checkTransactionStatus = async (transactionId: string) => {
    try {
      const res = await fetch(`/api/billing/check-status?transactionId=${transactionId}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.status === "COMPLETED") {
        setPollingStatus("COMPLETED");
        setTimeout(() => {
          setSelectedOrder(null);
          router.refresh();
        }, 3000); // Display success UI briefly
      } else if (data.status === "FAILED") {
        setPollingStatus("FAILED");
      }
    } catch (error) {
      console.error("Error polling status:", error);
    }
  };

  const handleDeposit = async (pkg: TopupPackage) => {
    try {
      setLoadingPkgId(pkg.id);
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      setSelectedOrder({
        id: pkg.id,
        amountVnd: data.amountVnd,
        transactionId: data.transactionId,
      });
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoadingPkgId(null);
    }
  };
  // 🌟 VÁ LỖ HỔNG VIETINBANK: Thêm chữ SEVQR theo yêu cầu của SePay
  const currentOrderMemo = selectedOrder ? `SEVQR NEXUS${selectedOrder.transactionId.toUpperCase()}` : "";
  const qrUrl = selectedOrder
    ? `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.accountNo}-compact2.png?amount=${selectedOrder.amountVnd}&addInfo=${encodeURIComponent(currentOrderMemo)}&accountName=${encodeURIComponent(bankConfig.accountName)}`
    : "";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Balance */}
      <div className="flex flex-col gap-2 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Nạp Credits</h1>
        <p className="text-sm text-muted-foreground">
          Nạp thêm credits để tiếp tục sử dụng các model AI. Thanh toán nhanh chóng qua chuyển khoản ngân hàng.
          <br />
          Credits sẽ được cộng tự động sau khi hệ thống xác nhận thanh toán.
        </p>
      </div>

      <Card className="relative bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-800/50 shadow-sm overflow-hidden group">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Credits khả dụng
              </p>
              <h2 className={`text-4xl font-bold tracking-tight transition-all duration-500 ${isAnimating
                ? "text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                : "text-emerald-700 dark:text-emerald-400 scale-100"
                }`}>
                {formatCredits(displayCredit)}
              </h2>
            </div>
          </div>
          <Link
            href="/billing/history-transactions"
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/50 dark:border-white/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-1.5 hover:bg-white/60 dark:hover:bg-black/40 transition-all shadow-sm active:scale-95"
          >
            <Clock className="w-3.5 h-3.5" /> Lịch sử giao dịch
          </Link>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          Gói nạp phổ biến
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isShark = pkg.priceVnd >= 500000; // Just to highlight a specific package
            const savings = calculateSavings(pkg.creditAmnt, pkg.bonusCredit);
            return (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md ${isShark
                  ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-[1.02]"
                  : "border-border"
                  }`}
              >
                {isShark && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
                )}
                <CardHeader className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                    {isShark && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> BEST VALUE 🔥
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 h-10">
                    {pkg.bonusCredit > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        🎁 Bonus +{formatCredits(pkg.bonusCredit)} credits (tiết kiệm {savings}%)
                      </span>
                    ) : (
                      "Phù hợp để thử nghiệm API và chatbot nhỏ."
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {formatVND(pkg.priceVnd).replace(" ₫", "")}
                    </span>
                    <span className="text-muted-foreground font-medium">VNĐ</span>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tổng Credit nhận:</span>
                      <span className="font-bold text-foreground">
                        {formatCredits(pkg.creditAmnt + pkg.bonusCredit)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    className={`w-full cursor-pointer h-12 text-md ${isShark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "hover:bg-primary/90 hover:shadow-md hover:scale-101 active:scale-99 transition-all duration-200"
                      }`}
                    onClick={() => handleDeposit(pkg)}
                    disabled={loadingPkgId === pkg.id}
                  >
                    {loadingPkgId === pkg.id ? "Đang tạo mã..." : "Nạp ngay"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment VietQR Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[96vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-border/50">
            <DialogTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Chuyển khoản thanh toán
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Quét mã <span className="font-bold text-foreground">VietQR</span> bằng ứng dụng ngân hàng để hoàn tất thanh toán.
              {pollingStatus === "COMPLETED" ? (
                <span className="text-emerald-500 font-bold block mt-1">Giao dịch thành công! Đang cộng credit...</span>
              ) : (
                " Thời gian xử lý từ 10s - 3 phút."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-2">
            {/* Left Col: Progress Steps */}
            <div className="md:col-span-2 order-2 md:order-1 border-t md:border-t-0 md:border-r border-border pt-4 md:pt-0 pr-0 md:pr-4 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs tracking-wider mb-4 text-muted-foreground uppercase">Tiến trình</h4>
                <div className="space-y-4">
                  {[
                    { id: 1, title: "Chọn gói", desc: "Đã chọn thẻ nạp", status: "completed" },
                    { id: 2, title: "Thanh toán", desc: "Quét mã VietQR", status: pollingStatus === "PENDING" ? "active" : "completed" },
                    { id: 3, title: "Xác nhận", desc: "Đợi ngân hàng", status: pollingStatus === "COMPLETED" ? "completed" : "pending" }, // Sẽ xanh cùng lúc với B4 khi có tiền
                    { id: 4, title: "Hoàn tất", desc: pollingStatus === "FAILED" ? "Giao dịch lỗi" : "Cộng credit", status: pollingStatus === "COMPLETED" ? "completed" : (pollingStatus === "FAILED" ? "failed" : "pending") }
                  ].map((step, index, arr) => (
                    <div key={step.id} className="relative flex items-start gap-3">
                      {index < arr.length - 1 && (
                        <div className={`absolute left-[9px] top-6 w-px h-8 ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-muted'}`} />
                      )}
                      <div className={`relative z-10 flex w-5 h-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'active' ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                          step.status === 'failed' ? 'bg-destructive text-destructive-foreground' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : step.status === 'failed' ? <XCircle className="w-3 h-3" /> : step.id}
                      </div>
                      <div>
                        <p className={`font-medium text-sm leading-none mb-1 ${step.status !== 'pending' ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Fallback UI */}
              {totalElapsedSeconds >= 300 && pollingStatus === "PENDING" && (
                <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 p-3 flex flex-col items-center text-center gap-2 rounded-lg border border-border">
                  <LifeBuoy className="w-6 h-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">Bạn chưa nhận được credit?</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-8">
                    Liên hệ hỗ trợ Zalo/Telegram
                  </Button>
                </div>
              )}
            </div>

            {/* Right Col: Info and Action */}
            <div className="md:col-span-3 order-1 md:order-2 flex flex-col space-y-4">
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 p-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold uppercase tracking-wide mb-2">Lưu ý quan trọng</p>
                  <div className="leading-snug text-[13px] sm:text-sm space-y-2">
                    <p>Để hệ thống xác nhận tự động:</p>
                    <div className="space-y-1 pl-1">
                      <p>• Chuyển <strong>đúng số tiền</strong> hiển thị</p>
                      <p>• Giữ nguyên mã hiển thị <strong>{currentOrderMemo}</strong></p>
                    </div>
                    <p>Nếu thông tin bị thay đổi, hệ thống có thể <span className="font-bold text-destructive">không nhận diện được giao dịch tự động</span>.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center p-2 bg-white rounded-xl mx-auto w-fit border border-border shadow-sm">
                {pollingStatus === "COMPLETED" ? (
                  <div className="w-[260px] h-[260px] flex flex-col items-center justify-center bg-emerald-50 rounded-lg text-emerald-600 gap-4">
                    <CheckCircle2 className="w-16 h-16" />
                    <p className="font-bold text-lg">Đã thanh toán!</p>
                  </div>
                ) : qrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrUrl} alt="VietQR Payment Code" className={`w-[260px] h-auto rounded-lg transition-all ${pollingStatus === "FAILED" ? "opacity-50 grayscale" : ""}`} />
                ) : (
                  <div className="w-[260px] h-[260px] flex items-center justify-center bg-muted/30">
                    Đang tạo mã QR...
                  </div>
                )}
              </div>

              <div className="mt-auto">
                {pollingStatus === "COMPLETED" ? (
                  <div className="flex flex-col items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-xs font-medium border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hệ thống đã cộng credit vào tài khoản.</span>
                  </div>
                ) : pollingStatus === "FAILED" ? (
                  <div className="flex flex-col items-center gap-1.5 px-4 py-2 bg-destructive/10 rounded-xl text-xs font-medium border border-destructive/20 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span>Giao dịch thất bại hoặc đã bị hủy.</span>
                  </div>
                ) : pollingStatus === "TIMEOUT" ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl text-xs font-medium border border-amber-200/50 text-amber-700 dark:text-amber-400">
                    <p className="text-center">Hệ thống đã ngừng tự động kiểm tra. Nếu bạn vừa chuyển tiền, vui lòng bấm nút bên dưới.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs w-full bg-white dark:bg-zinc-950"
                      onClick={() => {
                        setPollingStatus("PENDING"); // Bật lại trạng thái pending để nó quay thêm 1 vòng 5s
                        checkTransactionStatus(selectedOrder.transactionId);
                      }}
                    >
                      Tôi đã chuyển khoản
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 px-4 py-2 bg-muted/40 rounded-xl text-xs font-medium border border-border/50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-primary font-semibold">Đang kiểm tra giao dịch...</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Lần kiểm tra tiếp theo: <span className="font-bold font-mono">{checkCountdown}s</span> ({Math.floor(totalElapsedSeconds / 60)}:{(totalElapsedSeconds % 60).toString().padStart(2, '0')})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
