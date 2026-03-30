"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCredits } from "@/lib/utils";

interface BalanceDisplayProps {
  initialCredit: number;
}

export function BalanceDisplay({ initialCredit }: BalanceDisplayProps) {
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

      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;

      setDisplayCredit(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateValue);
      } else {
        // Hold the highlight for a brief moment after count-up
        setTimeout(() => setIsAnimating(false), 500);
        prevValueRef.current = initialCredit;
      }
    };

    animationFrameId = requestAnimationFrame(animateValue);
    return () => cancelAnimationFrame(animationFrameId);
  }, [initialCredit]);

  return (
    <div className="text-sm font-medium text-muted-foreground hidden sm:flex items-center gap-2">
      Số dư:{" "}
      <Badge
        variant="secondary"
        className={`font-bold transition-all duration-300 ${isAnimating
          ? "text-emerald-500 scale-110 bg-emerald-50 dark:bg-emerald-500/10 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          : "text-foreground bg-muted/50"
          }`}
      >
        {formatCredits(displayCredit)} cr
      </Badge>
    </div>
  );
}
