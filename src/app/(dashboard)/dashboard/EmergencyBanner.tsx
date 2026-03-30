"use client";

import React, { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";

interface PromoData {
  code: string;
  usesLeft: number;
  expiresAt: string | null;
}

export default function EmergencyBanner({ promoData }: { promoData: PromoData | null }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 15, s: 42 });

  useEffect(() => {
    // Nếu không có data, không chạy timer
    if (!promoData) return;

    // Nếu DB có set ngày hết hạn thật thì đếm ngược đến ngày đó
    const targetDate = promoData.expiresAt ? new Date(promoData.expiresAt).getTime() : null;

    const timer = setInterval(() => {
      if (targetDate) {
        // ĐẾM NGƯỢC THẬT (Dựa trên thời gian hết hạn của DB)
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
          clearInterval(timer);
          setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        } else {
          setTimeLeft({
            d: Math.floor(distance / (1000 * 60 * 60 * 24)),
            h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      } else {
        // ĐẾM NGƯỢC ẢO (Nếu sếp không set expiresAt, chạy một vòng lặp 15 phút giả tạo fomo)
        setTimeLeft(prev => {
          let { d, h, m, s } = prev;
          if (s > 0) s--;
          else if (m > 0) { m--; s = 59; }
          else if (h > 0) { h--; m = 59; s = 59; }
          else if (d > 0) { d--; h = 23; m = 59; s = 59; }
          else {
            clearInterval(timer);
            return prev;
          }
          return { d, h, m, s };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [promoData]);

  const formatTime = (digit: number) => digit.toString().padStart(2, "0");

  // Đóng banner nếu không có sự kiện nào hoặc số lượt đã hết
  if (!promoData || promoData.usesLeft <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-6 relative overflow-hidden group shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-200/50 dark:bg-amber-500/20 rounded-full animate-pulse transition-all">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              Mã quà tặng khẩn cấp!
              <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-200 uppercase tracking-tighter">Limited</span>
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Sử dụng ngay mã <span className="font-mono font-bold underline px-1.5 py-0.5 rounded bg-amber-200/50 dark:bg-amber-800/50">{promoData.code}</span> để nhận Credit! CHỈ CÒN <span className="font-bold text-amber-900 dark:text-amber-100">{promoData.usesLeft}</span> lượt dùng cuối cùng!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center sm:items-end">
            <span className="text-[10px] font-bold text-amber-800/60 dark:text-amber-400/60 uppercase tracking-widest">Thời gian còn lại</span>
            <div className="text-xl font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
              {timeLeft.d > 0 && (
                <>
                  <span>{timeLeft.d}</span>
                  <span className="text-xs font-sans mr-1">d</span>
                </>
              )}
              <span>{formatTime(timeLeft.h)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatTime(timeLeft.m)}</span>
              <span className="animate-pulse">:</span>
              <span>{formatTime(timeLeft.s)}</span>
              <span className="text-xs ml-1 font-sans">s</span>
            </div>
          </div>

          <div className="hidden lg:block h-8 w-px bg-amber-300/50 dark:bg-amber-700/50" />

          <button
            onClick={() => {
              const redeemInput = document.querySelector('input[placeholder*="Ví dụ:"]');
              if (redeemInput) {
                (redeemInput as HTMLInputElement).focus();
                (redeemInput as HTMLInputElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-md shadow-amber-600/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            Nhập mã ngay <Zap className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Decorative gradient sparkle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/10 blur-3xl -z-10" />
    </div>
  );
}