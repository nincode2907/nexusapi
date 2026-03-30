"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCredits } from "@/lib/utils";

// Khai báo kiểu dữ liệu truyền từ Server xuống
interface PromoData {
  code: string;
  usesLeft: number;
  expiresAt: string | null;
  reward?: number;
  total?: number;
}

export default function RedeemCard({ promoData }: { promoData: PromoData | null }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã quà tặng");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/billing/redeem-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      toast.success(data.message || "Đổi mã thành công! 🎉");
      setCode("");
      router.refresh(); // F5 lại để số dư nhảy múa
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-xl border-border/60 shadow-sm bg-background flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Đổi mã quà tặng</CardTitle>
          <CardDescription className="text-xs">Nhập mã để nhận credits miễn phí</CardDescription>
        </div>
        <Gift className="w-4 h-4 text-primary" />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">

        {/* Render hộp sự kiện NẾU có promoData thật */}
        {promoData ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed flex items-center gap-1.5">
              <Zap className="w-3 h-3 fill-emerald-500 shrink-0" />
              <span>
                Đang có sự kiện: Nhập mã <span className="font-bold underline cursor-pointer" onClick={() => setCode(promoData.code)} title="Bấm để điền nhanh">{promoData.code}</span> để nhận {promoData.reward ? `+${formatCredits(promoData.reward)} Cr` : "quà"}{" "}
                {promoData.total ? `(Chỉ dành cho ${promoData.total} người đầu tiên)` : ""}
              </span>
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground italic">Hiện không có sự kiện công khai. Nếu bạn có mã riêng, vui lòng nhập bên dưới.</p>
          </div>
        )}

        <form onSubmit={handleRedeem} className="space-y-3">
          <Input
            placeholder={promoData ? `VD: ${promoData.code}` : "Enter gift code..."}
            className="font-mono h-11 text-sm bg-muted/30 focus-visible:ring-emerald-500/30 uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} // Ép viết hoa cho đẹp
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đổi mã ngay"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}