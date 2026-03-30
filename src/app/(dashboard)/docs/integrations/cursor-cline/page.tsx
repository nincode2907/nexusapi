"use client";

import React from "react";
import {
    Code2, Settings, ToggleLeft, Plus, CheckCircle2,
    Zap, Sparkles, TerminalSquare, MousePointerClick, KeyRound
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function CursorClineDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Code2 className="w-3.5 h-3.5" /> AI Coding
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Tích hợp Cursor & Cline</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground bg-muted/40 px-4 py-2.5 rounded-lg border border-border/50 inline-flex items-start sm:items-center">
                    <span className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-indigo-500" />
                        <span><strong className="text-foreground">Cursor:</strong> IDE lập trình tích hợp AI.</span>
                    </span>
                    <span className="hidden sm:block text-border">|</span>
                    <span className="flex items-center gap-2">
                        <TerminalSquare className="w-4 h-4 text-indigo-500" />
                        <span><strong className="text-foreground">Cline:</strong> Extension AI coding cho VS Code.</span>
                    </span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Mở khóa sức mạnh lập trình AI không giới hạn. Thay vì trả phí thuê bao đắt đỏ hàng tháng, hãy cắm API của Nexus vào Cursor/Cline để dùng bao nhiêu trả bấy nhiêu, kết hợp với <strong>Prompt Caching tiết kiệm đến 90% chi phí</strong>.
                </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-full shrink-0 mt-1">
                        <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">Tại sao Nexus + Cursor là "Chân ái"?</h4>
                        <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mt-2 leading-relaxed">
                            Mỗi lần bạn chat, Cursor sẽ gửi TOÀN BỘ file code (hàng ngàn dòng) cho AI phân tích lại. Nếu dùng API thông thường chi phí input có thể tăng đáng kể.
                            <br />
                            Nhưng với Nexus, nhờ công nghệ <strong>Global Prompt Caching</strong>, đoạn code đó đã được hệ thống cache. Những request tiếp theo sử dụng nội dung tương tự có thể tận dụng cache này, giúp giảm đáng kể chi phí tới 90% và tăng tốc độ phản hồi.
                        </p>
                    </div>
                </div>

                {/* HỘP GIẢI THÍCH (Ví dụ thần thánh của sếp) */}
                <div className="ml-0 sm:ml-16 bg-background/60 dark:bg-background/40 border border-emerald-200/50 dark:border-emerald-500/20 rounded-lg p-4">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Global Caching hoạt động thế nào?
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Giả sử <strong>Dev A</strong> code xong đi uống cà phê 15 phút. Nếu tự dùng Key cá nhân, bộ đệm (Cache) trên OpenAI sẽ bị xóa ➜ Quay lại code tốn 100% tiền lại từ đầu.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        Nhưng tại Nexus, trong lúc Dev A nghỉ thì <strong>Dev B, Dev C</strong> vẫn đang code bằng Cursor. Vì Nexus gom chung Request, nên System Prompt khổng lồ của Cursor luôn được được duy trì trạng thái <strong>warm cache</strong>. Khi Dev A quay lại làm việc, hệ thống vẫn có thể tận dụng cache đó, giúp giảm chi phí token và tăng tốc độ phản hồi.
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* TABS HƯỚNG DẪN TỪNG TOOL */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">Hướng dẫn cấu hình</h2>

                <Tabs defaultValue="cursor" className="w-full mt-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12">
                        <TabsTrigger value="cursor" className="text-base gap-2">
                            <MousePointerClick className="w-4 h-4" /> Cursor IDE
                        </TabsTrigger>
                        <TabsTrigger value="cline" className="text-base gap-2">
                            <TerminalSquare className="w-4 h-4" /> Cline (VS Code)
                        </TabsTrigger>
                    </TabsList>

                    {/* ==========================================
                        TAB 1: HƯỚNG DẪN CURSOR IDE 
                    ========================================== */}
                    <TabsContent value="cursor" className="space-y-8 animate-in slide-in-from-bottom-2">

                        <div className="space-y-8 pl-2 border-l-2 border-muted ml-3 mt-4">

                            {/* BƯỚC 1: VÀO SETTINGS */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-muted-foreground" /> Mở cài đặt Models
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Trong giao diện Cursor, bấm vào icon bánh răng (Settings) ở góc trên bên phải, sau đó chọn tab <strong>Models</strong>.
                                </p>
                            </div>

                            {/* BƯỚC 2: CẤU HÌNH OPENAI BASE URL */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <ToggleLeft className="w-5 h-5 text-muted-foreground" /> Thay đổi Base URL & API Key
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-4">
                                    Cuộn xuống phần <strong>OpenAI API Key</strong> và thực hiện các bước sau:
                                </p>

                                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm max-w-2xl space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Bật công tắc Override OpenAI Base URL</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Gạt công tắc này lên, <strong>một ô nhập URL sẽ hiện ra</strong>. Điền vào đó: <code className="bg-muted px-1.5 py-0.5 rounded text-primary border border-border">https://api.nexus.com/api/v1</code>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 mt-4">
                                        <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Điền API Key</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Bật công tắc <strong>OpenAI API Key</strong> ở ngay phía trên, dán mã <code className="bg-muted px-1 py-0.5 rounded text-primary">sk-nexus-YOUR_KEY</code> của bạn vào ô và bấm Verify.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BƯỚC 3: MẸO NHẬP MODEL TAY */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-muted-foreground" /> Thêm Model thủ công (Cực quan trọng)
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-3">
                                    Vì Cursor mặc định chỉ hiển thị các model của OpenAI/Anthropic, để gọi được tất cả model của Nexus, bạn cần <strong>gõ tên model bằng tay</strong> vào khung thêm model (Add Custom Model).
                                </p>

                                <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 max-w-2xl">
                                    <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4" /> Mẹo cho bạn:
                                    </h4>
                                    <ul className="text-sm text-blue-800/80 dark:text-blue-400/80 space-y-2 list-disc list-inside">
                                        <li>Kéo xuống mục <strong>Models</strong>, tìm ô input có chữ <em>"Add model..."</em></li>
                                        <li>Gõ chính xác tên ID (VD: <code className="font-bold">claude-3-5-sonnet</code> hoặc <code className="font-bold">gpt-5.3-codex</code>)</li>
                                        <li>Bấm dấu <strong>[+]</strong> để thêm. Sau đó bật nút gạt màu xanh cho model vừa thêm.</li>
                                        <li>Bây giờ bạn có thể mở khung Chat (Ctrl+L) và chọn model đó để code!</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </TabsContent>

                    {/* ==========================================
                        TAB 2: HƯỚNG DẪN CLINE (VS CODE)
                    ========================================== */}
                    <TabsContent value="cline" className="space-y-8 animate-in slide-in-from-bottom-2">

                        <div className="space-y-8 pl-2 border-l-2 border-muted ml-3 mt-4">

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-muted-foreground" /> Mở Cài đặt Cline
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Trong VS Code, mở extension Cline và bấm vào biểu tượng bánh răng (Settings) ở góc trên.
                                </p>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <KeyRound className="w-5 h-5 text-muted-foreground" /> Chọn Provider & Điền Key
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-4">
                                    Trong mục <strong>API Provider</strong>, hãy thiết lập chính xác các thông số sau:
                                </p>

                                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm max-w-2xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-border/50">
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground w-1/3">API Provider</td>
                                                <td className="py-3"><span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded">OpenAI Compatible</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground">Base URL</td>
                                                <td className="py-3"><code className="font-mono text-emerald-500">https://api.nexus.com/api/v1</code></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground">API Key</td>
                                                <td className="py-3"><code className="font-mono text-emerald-500">sk-nexus-YOUR_API_KEY</code></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground">Model ID</td>
                                                <td className="py-3">
                                                    Nhập chính xác ID model bạn muốn. VD: <code className="font-mono bg-muted px-1 py-0.5 rounded">claude-3-5-sonnet</code>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                                <h3 className="font-bold text-lg">Hoàn tất</h3>
                                <p className="text-muted-foreground mt-1">
                                    Bấm Save và bắt đầu ra lệnh cho Cline phân tích Codebase của bạn với chi phí rẻ chưa từng có!
                                </p>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    );
}