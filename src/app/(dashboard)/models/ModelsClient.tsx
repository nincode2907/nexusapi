"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Code, Zap, Sparkles, Cpu, Copy, Key, Bot, Layers, Globe, Flame, Gift, Check } from "lucide-react";
import { toast } from "sonner";
import { ModelPricing } from "./ModelCard";
import { OpenAILogo, AnthropicLogo, GoogleLogo } from "@/components/icons";

export interface EnhancedModelPricing extends ModelPricing {
  badge?: string;
  badgeColor?: string;
  usageCount?: number;
}

interface ModelsClientProps {
  models: EnhancedModelPricing[];
}

export const PROVIDER_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  // 1. Các Filter Logic (Không có trong DB, tự chế ra để thao túng tâm lý)
  "ALL": { label: "Tất cả", icon: <Flame className="w-4 h-4 text-orange-500" />, color: "bg-orange-100 text-orange-800" },
  "FREE": { label: "Miễn Phí - Giảm Giá", icon: <Gift className="w-4 h-4 text-red-500" />, color: "bg-red-50 text-red-700" },

  // 2. Các Hãng AI (Khớp 100% với cột provider trong Database)
  "OpenAI": { label: "OpenAI", icon: <OpenAILogo className="w-4 h-4" />, color: "border-gray-200" },
  "Anthropic": { label: "Anthropic", icon: <AnthropicLogo className="w-4 h-4" />, color: "border-gray-200" },
  "Google": { label: "Google", icon: <GoogleLogo className="w-4 h-4" />, color: "border-gray-200" },
  "DeepSeek": { label: "DeepSeek", icon: <Sparkles className="w-4 h-4 text-blue-600" />, color: "border-gray-200" },

  // Default nếu sếp thêm hãng mới vào DB mà quên update code
  "DEFAULT": { label: "Hãng Khác", icon: <Bot className="w-4 h-4 text-slate-500" />, color: "border-slate-200" }
};

// Helpers
function getProviderInfo(provider: string) {
  const p = (provider || "").toLowerCase();
  const keyMatch = Object.keys(PROVIDER_MAP).find(k => k.toLowerCase() === p);
  if (keyMatch && PROVIDER_MAP[keyMatch]) return PROVIDER_MAP[keyMatch];
  return PROVIDER_MAP["DEFAULT"];
}

function formatContext(num: number) {
  if (!num) return "N/A";
  if (num >= 1000) return (num / 1000) + "K";
  return num.toString();
}

export default function ModelsClient({ models }: ModelsClientProps) {
  // State
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Filter List (Dynamic DB + Static Tabs)
  const dbProviders = Array.from(new Set(models.map(m => m.provider || "Khác").filter(Boolean)));
  const filterTabs = ["ALL", "FREE", ...dbProviders];

  // Apply Filter and Sort
  let filtered = [...models];

  if (providerFilter === "FREE") {
    filtered = filtered.filter(m => m.priceInPerToken === 0 && m.priceOutPerToken === 0);
  } else if (providerFilter !== "ALL") {
    filtered = filtered.filter(m => (m.provider || "Khác") === providerFilter);
  }

  filtered.sort((a, b) => {
    if (sortBy === "popular") {
      return (b.usageCount || 0) - (a.usageCount || 0);
    } else if (sortBy === "priceAsc") {
      return (a.priceInPerToken || 0) - (b.priceInPerToken || 0);
    } else if (sortBy === "contextDesc") {
      return (b.contextWindow || 0) - (a.contextWindow || 0);
    }
    return 0;
  });

  const SORT_LABEL = {
    popular: "🔥 Phổ biến nhất",
    priceAsc: "💰 Giá rẻ nhất",
    contextDesc: "📑 Context lớn nhất",
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success("Đã copy Model ID!");
    }).catch(() => {
      toast.error("Không thể copy.");
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Siêu thị Models</h1>
        <p className="text-sm text-muted-foreground w-full max-w-3xl leading-relaxed mt-1">
          Khám phá danh sách các mô hình AI mạnh mẽ nhất được hỗ trợ bởi NexusAPI.
          Tìm kiếm nhanh chóng, lọc theo biểu giá và khả năng xử lý.
        </p>
      </div>

      {/* 1. Page Header & Tooling Bar (Sticky Top) */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left */}


        {/* Center: Providers Scroll */}
        <div className="flex-1 overflow-x-auto flex items-center gap-2 scrollbar-hide py-1">
          {filterTabs.map(p => {
            const info = PROVIDER_MAP[p] || getProviderInfo(p);
            const isSelected = providerFilter === p;

            const baseClass = "whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border outline-none cursor-pointer";
            const activeClass = "bg-primary text-primary-foreground border-primary shadow-sm scale-[0.98]";
            const inactiveClass = info.color?.includes("bg-")
              ? `opacity-90 hover:opacity-100 ${info.color}`
              : `bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground ${info.color || 'border-transparent'}`;

            return (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`${baseClass} ${isSelected ? activeClass : inactiveClass}`}
              >
                {info.icon}
                {info.label || p}
              </button>
            );
          })}
        </div>

        {/* Right: Sort Dropdown */}
        <Link href="/api-keys" className="shrink-0">
          <Button className="font-semibold shadow-sm w-full md:w-auto cursor-pointer hover:bg-primary/90 hover:shadow-md hover:scale-101 active:scale-99 transition-all duration-200">
            <Key className="w-4 h-4 mr-2" /> Tạo API Key
          </Button>
        </Link>
        <div className="shrink-0">
          <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
            <SelectTrigger className="w-auto min-w-[240px] bg-background border border-border/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl h-[38px] px-4 hover:bg-muted/40 active:scale-[0.97] transition-all duration-150 font-medium text-[13px] text-foreground">
              {SORT_LABEL[sortBy as keyof typeof SORT_LABEL]}
            </SelectTrigger>
            <SelectContent align="end" className="rounded-2xl border border-border/50 shadow-xl min-w-[240px] p-1.5 backdrop-blur-xl bg-background/95">
              <SelectItem value="popular" className="py-2.5 pl-3 pr-9 rounded-xl text-[13.5px] font-medium cursor-pointer mb-0.5">
                {SORT_LABEL.popular}
              </SelectItem>
              <SelectItem value="priceAsc" className="py-2.5 pl-3 pr-9 rounded-xl text-[13.5px] font-medium cursor-pointer mb-0.5">
                {SORT_LABEL.priceAsc}
              </SelectItem>
              <SelectItem value="contextDesc" className="py-2.5 pl-3 pr-9 rounded-xl text-[13.5px] font-medium cursor-pointer">
                {SORT_LABEL.contextDesc}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Compact Model Card Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
        {filtered.map(model => {
          const isFree = model.priceInPerToken === 0 && model.priceOutPerToken === 0;
          const features = model.features || [];

          return (
            <div key={model.id} className="border border-border/50 rounded-2xl p-4 bg-background shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group">
              <div>
                {/* Top Row: Provider + Name & Badge */}
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <div className="text-foreground shrink-0 mt-0.5" title={model.provider || "Khác"}>
                      {getProviderInfo(model.provider || "Khác").icon}
                    </div>
                    <h3 className="font-bold text-base truncate leading-tight group-hover:text-primary transition-colors" title={model.displayName || model.modelId}>
                      {model.displayName || model.modelId}
                    </h3>
                  </div>
                  {model.badge && (
                    <Badge
                      className="text-[10px] px-2 py-0 border-0 font-black tracking-wider shrink-0 shadow-sm h-5"
                      style={{ backgroundColor: model.badgeColor || '#6366f1', color: '#fff' }}
                    >
                      {model.badge}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-[13px] text-muted-foreground line-clamp-2 min-h-[38px] leading-relaxed mb-4">
                  {model.description}
                </p>

                {/* Specs Row */}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80 font-bold tracking-wide uppercase mb-3 bg-muted/20 px-2 py-1.5 rounded-md">
                  <div className="flex items-center gap-1.5 text-foreground/80">
                    <Cpu className="w-3.5 h-3.5" />
                    Context: {formatContext(model.contextWindow)}
                  </div>
                  {features.length > 0 && (
                    <div className="flex items-center gap-1.5 border-l border-border/50 pl-3">
                      {features.includes("Vision") && <span title="Hỗ trợ Vision"><Eye className="w-3.5 h-3.5 text-blue-500" /></span>}
                      {features.includes("Function calling") && <span title="Function Calling"><Code className="w-3.5 h-3.5 text-purple-500" /></span>}
                      {features.includes("Streaming") && <span title="Streaming"><Zap className="w-3.5 h-3.5 text-amber-500" /></span>}
                    </div>
                  )}
                </div>

                {/* Pricing Box */}
                <div className="bg-muted/40 rounded-xl p-2.5 flex items-center justify-between border border-border/40 mb-4 h-[52px]">
                  {isFree ? (
                    <span className="text-sm font-black text-emerald-500 flex items-center gap-1.5 mx-auto py-1">
                      <Sparkles className="w-4 h-4" /> MIỄN PHÍ 100%
                    </span>
                  ) : (
                    <>
                      <div className="flex flex-col text-center flex-1 border-r border-border/60">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/70 mb-0.5">Input</span>
                        <span className="text-xs font-bold text-foreground"> ~ {Math.round(model.priceInPerToken * 1000000).toLocaleString('vi-VN')} <span className="font-normal text-muted-foreground/80">cr/1M</span></span>
                      </div>
                      <div className="flex flex-col text-center flex-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/70 mb-0.5">Output</span>
                        <span className="text-xs font-bold text-foreground"> ~ {Math.round(model.priceOutPerToken * 1000000).toLocaleString('vi-VN')} <span className="font-normal text-muted-foreground/80">cr/1M</span></span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Button - Copy */}
              <div className="mt-auto pt-1">
                <Button
                  variant="outline"
                  className="w-full h-8 text-[11px] bg-muted/30 border-border/60 hover:bg-accent hover:text-accent-foreground text-foreground/80 font-mono tracking-tight flex items-center justify-center gap-2 rounded-lg cursor-pointer"
                  onClick={() => handleCopy(model.modelId)}
                >
                  <Copy className="w-3 h-3" />
                  ID: {model.modelId}
                </Button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed rounded-2xl bg-muted/10">
            <h3 className="text-lg font-medium text-muted-foreground">Chưa có mô hình nào phù hợp bộ lọc.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
