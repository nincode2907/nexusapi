"use client";

import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Code, Zap, Sparkles, Cpu, Layers, Copy } from "lucide-react";
import { toast } from "sonner";
import React from "react";

export interface ModelPricing {
  id: string;
  provider: string;
  modelId: string;
  displayName?: string;
  description?: string;
  priceInPerToken: number;
  priceOutPerToken: number;
  isActive: boolean;
  features?: string[];
  contextWindow: number;
  maxOutputTokens: number;
  knowledgeCutoff?: string;
}

export interface ModelCardProps {
  model: ModelPricing | any;
}

// 1. Dictionary Mapper
const FEATURE_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "Vision": {
    label: "Thị giác máy (Vision)",
    icon: <Eye className="w-3.5 h-3.5" />,
    color: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
  },
  "Function calling": {
    label: "Gọi hàm (Tool/Function)",
    icon: <Code className="w-3.5 h-3.5" />,
    color: "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
  },
  "Streaming": {
    label: "Phản hồi thời gian thực",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
  }
};

function getFeatureConfig(featureName: string) {
  const exactMatch = Object.keys(FEATURE_MAP).find(k => k.toLowerCase() === featureName.toLowerCase());
  if (exactMatch) return FEATURE_MAP[exactMatch];

  return {
    label: featureName,
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: "text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  };
}

function formatNumber(num: number) {
  if (!num) return "N/A";
  if (num >= 1000) {
    return (num / 1000) + "K";
  }
  return num.toString();
}

export function ModelCard({ model }: ModelCardProps) {
  const nameToDisplay = model.displayName || model.modelId || "Unknown Model";
  const isFree = model.priceInPerToken === 0 && model.priceOutPerToken === 0;

  // Derive status based on heuristics
  const modelIdLower = model.modelId?.toLowerCase() || "";
  const isNew = modelIdLower.includes("mini") || modelIdLower.includes("preview") || modelIdLower.includes("flash") || modelIdLower.includes("qwq");
  const isPopular = modelIdLower.includes("gpt-4o") || modelIdLower.includes("claude-3-5") || modelIdLower.includes("sonnet") || modelIdLower.includes("gemini");

  const inputPriceM = (model.priceInPerToken * 1000000);
  const outputPriceM = (model.priceOutPerToken * 1000000);
  const cacheHitPriceM = (model.priceInPerToken * 1000000 * 0.1);

  const handleCopy = () => {
    navigator.clipboard.writeText(model.modelId).then(() => {
      toast.success("Đã copy Model ID thành công!");
    }).catch(() => {
      toast.error("Không thể copy, vui lòng thử lại.");
    });
  };

  return (
    <Card className="flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-border/60 bg-background">
      <CardHeader className="pb-4">
        {/* Header Layout */}
        <div className="flex justify-between items-start mb-3 h-6">
          <div className="flex items-center gap-2">
            {model.provider?.toLowerCase() === "openai" ? (
              <svg 
                className="w-5 h-5 text-foreground" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.282 9.821a5.985 5.985 0 0 0-1.561-3.268 6.01 6.01 0 0 0-3.21-1.536 5.984 5.984 0 0 0-5.356 2.493 5.982 5.982 0 0 0-5.83-2.008 6.01 6.01 0 0 0-3.953 2.658 5.982 5.982 0 0 0-.256 6.052 5.985 5.985 0 0 0 1.56 3.268 6.01 6.01 0 0 0 3.21 1.536 5.984 5.984 0 0 0 5.356-2.493 5.982 5.982 0 0 0 5.83 2.008 6.01 6.01 0 0 0 3.953-2.658 5.982 5.982 0 0 0 .256-6.052zm-6.205 11.23a4.01 4.01 0 0 1-3.793-2.651l.056-.032 4.416-2.548a.962.962 0 0 0 .484-.836V7.476l1.83 1.056a3.978 3.978 0 0 1 1.956 3.42 4.025 4.025 0 0 1-5.187 3.868l.244.417zM7.106 20.32A4.01 4.01 0 0 1 5.38 16.9l.024.046V11.85a.962.962 0 0 0-.482-.835L1.83 9.245l-1.055 1.83a3.98 3.98 0 0 1 3.42 1.956A4.025 4.025 0 0 1 7.106 20.32zM3.465 7.734a4.01 4.01 0 0 1 2.483-3.916l-.031.054 2.548 4.416a.962.962 0 0 0 .836.484h7.508L14.98 6.942A3.98 3.98 0 0 1 11.56 4.986a4.025 4.025 0 0 1-3.868 5.187v-.653l-4.227-1.786zm14.162-.225l-.024-.046v5.096a.962.962 0 0 0 .482.835l3.092 1.77 1.055-1.83a3.98 3.98 0 0 1-3.42-1.956 4.025 4.025 0 0 1 1.159-8.49l-2.344 4.007v.615zm2.844 7.632-2.548-4.416a.962.962 0 0 0-.836-.484H9.579L11.4 8.632a3.98 3.98 0 0 1 3.42 1.956 4.025 4.025 0 0 1 3.868-5.187v.653l1.784 4.227a4.01 4.01 0 0 1-2.483 3.916l.031-.054zM12 15.353a3.353 3.353 0 1 1 0-6.706 3.353 3.353 0 0 1 0 6.706z"/>
              </svg>
            ) : null}
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
              {model.provider || "Khác"}
            </span>
          </div>

          <div>
            {isNew ? (
              <Badge className="bg-purple-500 hover:bg-purple-600 text-white font-medium border-0 rounded-md text-[10px] px-2 py-0.5">
                MÔ HÌNH MỚI
              </Badge>
            ) : isPopular ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium border-0 rounded-md text-[10px] px-2 py-0.5">
                PHỔ BIẾN
              </Badge>
            ) : null}
          </div>
        </div>

        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          {nameToDisplay}
          {modelIdLower.includes("gpt") && <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed text-foreground/80 mt-2 line-clamp-2 min-h-[44px]">
          {model.description || "Mô hình xử lý ngôn ngữ mạnh mẽ được tối ưu hóa cho nhiều tác vụ."}
        </CardDescription>

        {/* Model ID Copy Box */}
        <div 
          className="relative mt-4 group cursor-pointer"
          onClick={handleCopy}
        >
          <Input 
            className="font-mono text-sm bg-muted/50 pr-8 cursor-pointer border-border/60 hover:border-border/80 transition-colors h-9" 
            value={model.modelId} 
            readOnly 
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
             <Copy className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 py-4 border-t border-border/40 space-y-5">
        {/* Features Section */}
        {model.features && model.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {model.features.map((feature: string, idx: number) => {
              const config = getFeatureConfig(feature);
              return (
                <span key={idx} className={`rounded-full border px-2 py-0.5 text-[11px] font-medium flex items-center gap-1 ${config.color}`}>
                  {config.icon}
                  {config.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Pricing Section */}
        <div>
          <h4 className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-3 px-1">Chi phí</h4>
          {isFree ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 text-sm shadow-sm animate-in fade-in zoom-in duration-300 w-fit pointer-events-none">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Miễn phí 100%
            </Badge>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/50">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Input</div>
                <div className="text-sm font-bold text-foreground">
                  {inputPriceM.toLocaleString('vi-VN')} credits<span className="text-xs font-normal text-muted-foreground"> / 1M</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/50">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Output</div>
                <div className="text-sm font-bold text-foreground">
                  {outputPriceM.toLocaleString('vi-VN')} credits<span className="text-xs font-normal text-muted-foreground"> / 1M</span>
                </div>
              </div>
              {/* Add-on: Cache hit cost */}
              <div className="col-span-2 mt-1">
                <div className="text-center">
                  <span className="text-[11px] mt-0.5 font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 py-1.5 px-3 rounded-md inline-block">
                    ⚡ Giá Cache Hit: Chỉ <strong className="font-bold">{cacheHitPriceM.toLocaleString('vi-VN')}</strong> cr / 1M
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Specs Footer */}
      <CardFooter className="bg-muted/50 border-t border-border/60 p-4 pb-3 gap-2 grid grid-cols-3 items-center">
        <div className="flex flex-col gap-1 text-center border-r border-border/60" title="Max Context Window">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Context</span>
          </div>
          <span className="text-sm font-medium">{formatNumber(model.contextWindow)}</span>
        </div>

        <div className="flex flex-col gap-1 text-center border-r border-border/60" title="Max Output Tokens">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Output</span>
          </div>
          <span className="text-sm font-medium">{formatNumber(model.maxOutputTokens)}</span>
        </div>

        <div className="flex flex-col gap-1 text-center" title={model.knowledgeCutoff || "Knowledge Cutoff"}>
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Cutoff</span>
          </div>
          <span className="text-xs font-medium truncate px-1">
            {model.knowledgeCutoff || "Live"}
          </span>
        </div>
      </CardFooter>

      {/* Main CTA Button */}
      <div className="p-4 pt-1 bg-muted/50">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all text-sm h-10">
          TẠO KEY ĐỂ DÙNG THỬ
        </Button>
      </div>

    </Card>
  );
}
