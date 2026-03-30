"use client";

import React from "react";
import {
    Rocket, Crosshair, ServerCrash, FileJson,
    CheckCircle2, AlertTriangle, Zap, Terminal, XCircle, Sparkles, Code2, BrainCircuit
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function OpenClawDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Hot Trend
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Tích hợp OpenClaw</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold">Router AI siêu tốc.</span>
                    <br />
                    Hướng dẫn cấu hình OpenClaw để kết nối trực tiếp với Nexus API chỉ với 1 lần copy–paste, không cần cài thêm công cụ trung gian.
                </p>
            </div>

            {/* ĐẬP THẲNG ĐỐI THỦ: VÌ SAO CHỌN NEXUS? */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <Crosshair className="w-6 h-6 text-primary" /> Vì sao nên dùng Nexus?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bóc phốt cách cũ */}
                    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold">
                            <XCircle className="w-5 h-5" /> Các giải pháp khác (Dùng tool trung gian)
                        </div>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">✖</span>
                                <span>Phải cài đặt thêm <span className="font-bold">Node.js, NPM hoặc các router GUI như 9Router.</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">✖</span>
                                <span>Dữ liệu đi vòng qua localhost rồi mới ra internet ➜ <strong>Độ trễ cao.</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">✖</span>
                                <span>Phải dùng <span className="font-bold">PM2 (một công cụ để chạy chương trình Node.js ở chế độ nền)</span> nên tốn RAM và có thể gây lỗi nếu cấu hình sai.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tôn vinh Nexus */}
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-5 h-5" /> Cách của Nexus (Native Direct)
                        </div>
                        <ul className="space-y-3 text-sm text-emerald-900/80 dark:text-emerald-300/80">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✔</span>
                                <span>Chỉ cần chỉnh đúng 1 file <code className="font-bold">config.json</code> mặc định của OpenClaw là xong.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✔</span>
                                <span>Kết nối trực tiếp đến máy chủ Nexus ➜ <strong>Độ trễ cực thấp.</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✔</span>
                                <span>Hoạt động <strong>siêu nhẹ và ổn định</strong>, không phụ thuộc tool trung gian.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* HƯỚNG DẪN CẤU HÌNH JSON (STEP-BY-STEP) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <FileJson className="w-6 h-6 text-primary" /> Cấu hình File config.json
                </h2>

                <div className="space-y-8 pl-2 border-l-2 border-muted ml-3 mt-6">

                    {/* BƯỚC 1 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                        <h3 className="font-bold text-lg">Mở file cấu hình OpenClaw</h3>
                        <p className="text-muted-foreground mt-1">
                            Trên máy tính của bạn, hãy tìm và mở file cấu hình gốc của OpenClaw. Thường nó sẽ nằm ở đường dẫn:
                        </p>
                        <code className="inline-block mt-2 bg-muted px-2 py-1 rounded-md text-sm font-mono text-foreground border border-border">
                            ~/.openclaw/config.json
                        </code>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                            (Hoặc file config.json trong thư mục cài đặt OpenClaw của bạn).
                        </p>
                    </div>

                    {/* BƯỚC 2 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                        <h3 className="font-bold text-lg">Dán cấu hình Nexus</h3>
                        <p className="text-muted-foreground mt-1 mb-4">
                            Copy và ghi đè toàn bộ nội dung trong file đó bằng cấu hình chuẩn dưới đây:
                        </p>

                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden shadow-sm max-w-2xl">
                            <div className="flex items-center px-4 py-2 bg-zinc-900/50 border-b border-white/10 gap-2">
                                <Terminal className="w-4 h-4 text-zinc-400" />
                                <span className="text-xs font-mono text-zinc-400">config.json</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                    {`{
  "routing": {
    "default_provider": "nexus_api"
  },
  "providers": {
    "nexus_api": {
      "type": "openai",
      "base_url": "https://api.nexus.com/api/v1",
      "api_key": "sk-nexus-YOUR_API_KEY",
      "models": [
        "gpt-4o-mini",
        "claude-3-5-sonnet",
        "gemini-1.5-pro"
      ]
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* BƯỚC 3 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                        <h3 className="font-bold text-lg">Thay API Key & Hoàn tất</h3>
                        <p className="text-muted-foreground mt-1 mb-3">
                            Trong đoạn code vừa dán, hãy tìm và thay thế đoạn:
                        </p>
                        <code className="inline-block bg-primary/10 text-primary font-bold px-2 py-1 rounded-md text-sm border border-primary/20 mb-3">
                            sk-nexus-YOUR_API_KEY
                        </code>
                        <p className="text-muted-foreground">
                            bằng API Key Nexus thật của bạn.
                        </p>
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 border border-emerald-200 dark:border-emerald-500/20 inline-block mt-3">
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Sau đó lưu file và khởi động lại OpenClaw là xong!
                            </p>
                        </div>
                    </div>

                    {/* BƯỚC 4 & GIẢI THÍCH MODEL */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">4</div>
                        <h3 className="font-bold text-lg">Khai báo Model & Chọn "Hàng ngon"</h3>
                        <p className="text-muted-foreground mt-1 mb-3">
                            Mảng <code>"models"</code> trong file config dùng để báo cho OpenClaw biết Nexus hỗ trợ những model nào. Bạn có thể tự do thêm bất kỳ tên model nào có trong thư viện của Nexus vào mảng này (nhớ gõ đúng tên ID).
                        </p>

                        {/* BẢNG FOMO CHỐT SALE */}
                        <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 mt-4">
                            <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Bí kíp chọn Model cho người mới (Cheat Sheet)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-background rounded-lg p-4 border border-border shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 font-semibold text-foreground">
                                        <Code2 className="w-4 h-4 text-emerald-500" /> Tốt nhất cho lập trình
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Code thông minh nhất, ít bug, hiểu file dự án dài.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">claude-3-5-sonnet</code>
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">gpt-4o</code>
                                    </div>
                                </div>

                                <div className="bg-background rounded-lg p-4 border border-border shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 font-semibold text-foreground">
                                        <BrainCircuit className="w-4 h-4 text-purple-500" /> Suy luận Logic
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">AI tự "suy nghĩ" ngầm trước khi trả lời. Trùm giải thuật & Toán.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">deepseek-reasoner</code>
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">o1-mini</code>
                                    </div>
                                </div>

                                <div className="bg-background rounded-lg p-4 border border-border shadow-sm md:col-span-2">
                                    <div className="flex items-center gap-2 mb-2 font-semibold text-foreground">
                                        <Zap className="w-4 h-4 text-yellow-500" /> Nhanh và chi phí thấp
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">Dành cho các tác vụ hỏi đáp nhanh, dịch thuật, tóm tắt. Cực rẻ, gõ chữ như súng liên thanh.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">gpt-4o-mini</code>
                                        <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">gemini-1.5-flash</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BƯỚC 5: QUICK TEST (Khoảnh khắc Aha!) */}
                    <div className="relative pl-6 pt-2">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold rounded-full flex items-center justify-center shadow-sm">
                            <Rocket className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">Chạy thử nghiệm</h3>
                        <p className="text-muted-foreground mt-1 mb-4">
                            Sau khi <strong>khởi động lại OpenClaw</strong>, hãy thử gửi một prompt đơn giản:
                        </p>

                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-800 shadow-sm inline-block min-w-[280px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs text-zinc-400 font-mono">You:</span>
                            </div>
                            <code className="text-emerald-400 font-mono text-base font-bold">Hello Nexus!</code>
                        </div>

                        <p className="text-sm font-medium text-foreground mt-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Nếu AI trả lời ➜ <strong className="text-emerald-600 dark:text-emerald-400">Xin chúc mừng, cấu hình đã thành công 100%! 🎉</strong>
                        </p>
                    </div>

                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* TROUBLESHOOTING (XỬ LÝ LỖI TIMEOUT) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <ServerCrash className="w-6 h-6 text-orange-500" /> Xử lý lỗi thường gặp
                </h2>

                <div className="space-y-4">
                    {/* Lỗi 1 */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" /> Lỗi: Timeout fetching provider / AI trả lời bị ngắt
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            <strong>Nguyên nhân:</strong> Do cấu hình Timeout mặc định của OpenClaw quá ngắn (thường là 10s), khi gọi các model suy luận sâu như DeepSeek R1 hoặc Claude Opus sẽ bị ép ngắt kết nối trước khi AI kịp trả lời.
                        </p>
                        <div className="bg-muted rounded-md p-3">
                            <p className="text-sm font-semibold mb-2 text-foreground">Cách khắc phục:</p>
                            <p className="text-sm text-muted-foreground">
                                Thêm dòng <strong>timeout_ms</strong> vào cấu hình:
                            </p>
                            <pre className="mt-2 text-xs font-mono bg-zinc-950 text-emerald-400 p-2 rounded">
                                {`"nexus_api": {
  "type": "openai",
  "base_url": "...",
  "timeout_ms": 60000  // <--- Thêm dòng này
}`}
                            </pre>
                        </div>
                    </div>

                    {/* Lỗi 2 */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">
                            <XCircle className="w-5 h-5 text-red-500" /> Lỗi: "Model not found"
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            <strong>Nguyên nhân:</strong> Tên model trong file config không khớp với thư viện model của Nexus.
                        </p>
                        <div className="bg-muted rounded-md p-3">
                            <p className="text-sm font-semibold mb-2 text-foreground">Cách khắc phục:</p>
                            <p className="text-sm text-muted-foreground">
                                Truy cập <Link
                                    href="/models"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Thư viện Model
                                </Link> và copy đúng chính xác tên model.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <br />
                                Ví dụ:
                            </p>
                            <p className="text-sm text-muted-foreground">✔ gpt-4o</p>
                            <p className="text-sm text-muted-foreground">❌ gpt-4o-mini</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 border border-emerald-200 dark:border-emerald-500/20 inline-block mt-3">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Sau khi cấu hình đúng, OpenClaw sẽ sử dụng Nexus API làm router mặc định.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}