"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function CacheGauge({ hitRate }: { hitRate: number }) {
  const data = [
    { name: "Hit", value: hitRate },
    { name: "Miss", value: 100 - hitRate },
  ];
  return (
    <div className="relative h-32 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            <Cell key="Hit" fill="#10b981" />
            <Cell key="Miss" fill="#e2e8f0" className="dark:fill-slate-800" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-3xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
          {hitRate.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
