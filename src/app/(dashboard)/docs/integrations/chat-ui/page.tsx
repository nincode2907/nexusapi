"use client";

import React from "react";
import {
    MessageSquare, Settings, CheckCircle2, RefreshCw,
    LayoutDashboard, Globe, KeyRound, Smartphone, Zap, HelpCircle, Wallet, Layers, Infinity, ShieldCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function ChatUIDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <MessageSquare className="w-3.5 h-3.5" /> Giao diện Chat
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Open WebUI & Chatbox</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground bg-muted/40 px-4 py-3 rounded-lg border border-border/50 inline-flex items-start sm:items-center">
                    <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-pink-500" />
                        <span><strong className="text-foreground">Open WebUI:</strong> giao diện chat AI chạy trên web, có trải nghiệm tương tự ChatGPT.</span>
                    </span>
                    <span className="hidden sm:block text-border">|</span>
                    <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-pink-500" />
                        <span><strong className="text-foreground">Chatbox:</strong> Ứng dụng chat AI cài trực tiếp trên máy tính (Windows, macOS, Linux).</span>
                    </span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed pt-2">
                    Bạn không cần biết lập trình. Chỉ với vài phút cấu hình, bạn có thể sử dụng hơn 30+ mô hình AI từ Nexus trong một giao diện chat quen thuộc.
                </p>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* GIẢI THÍCH VỀ AI CLIENT (Giọng văn chuyên nghiệp, khách quan) */}
            <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm mt-8">
                <h2 className="text-xl font-bold border-b border-border pb-3 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" /> Các ứng dụng này hoạt động thế nào?
                </h2>

                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Open WebUI và Chatbox là các <strong>AI Client</strong>. Chúng cung cấp giao diện chat giống hệt ChatGPT, nhưng cho phép bạn kết nối với API Key của riêng mình. Điều này giúp bạn: sử dụng nhiều model AI khác nhau, kiểm soát chi phí theo lượng thực dùng, và không bị giới hạn bởi các gói thuê bao cố định.
                    </p>

                    {/* LỢI ÍCH */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-foreground">Lợi ích khi dùng Nexus với các AI Client</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-2 font-semibold text-foreground mb-1.5">
                                    <Wallet className="w-4 h-4 text-emerald-500" /> Chi phí linh hoạt
                                </div>
                                <p className="text-sm text-muted-foreground">Thay vì trả phí thuê bao hàng tháng, bạn chỉ trả tiền theo lượng token sử dụng thực tế.</p>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-2 font-semibold text-foreground mb-1.5">
                                    <Layers className="w-4 h-4 text-blue-500" /> Nhiều Model trong 1 giao diện
                                </div>
                                <p className="text-sm text-muted-foreground">Bắt đầu chat với GPT-4o, sau đó chuyển sang Claude hoặc Gemini để so sánh kết quả ngay trong cùng một luồng hội thoại.</p>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-2 font-semibold text-foreground mb-1.5">
                                    <Infinity className="w-4 h-4 text-purple-500" /> Không giới hạn lượt chat
                                </div>
                                <p className="text-sm text-muted-foreground">API không bị giới hạn số tin nhắn theo khung giờ (như giới hạn 40 tin/3 giờ của một số dịch vụ thuê bao).</p>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-2 font-semibold text-foreground mb-1.5">
                                    <ShieldCheck className="w-4 h-4 text-orange-500" /> Quyền riêng tư tốt hơn
                                </div>
                                <p className="text-sm text-muted-foreground">Theo chính sách của nhiều nhà cung cấp (như OpenAI), dữ liệu gửi qua API mặc định không được dùng để huấn luyện mô hình.</p>
                            </div>
                        </div>
                    </div>

                    {/* BẢNG SO SÁNH */}
                    <div>
                        <h3 className="text-base font-semibold mb-3 text-foreground">So sánh nhanh</h3>
                        <div className="overflow-hidden border border-border/50 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="py-2.5 px-4 font-semibold text-muted-foreground w-1/3 border-b border-border/50">Phương thức</th>
                                        <th className="py-2.5 px-4 font-semibold text-muted-foreground border-b border-border/50">Đặc điểm</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    <tr className="bg-background">
                                        <td className="py-3 px-4 font-medium">Chat AI chính thức</td>
                                        <td className="py-3 px-4 text-muted-foreground">Thuê bao cố định, thường chỉ dùng được 1 hệ AI do hãng đó cung cấp.</td>
                                    </tr>
                                    <tr className="bg-background">
                                        <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">Nexus + Open WebUI</td>
                                        <td className="py-3 px-4 text-muted-foreground">Chat trên nền tảng Web, linh hoạt hỗ trợ hơn 30+ Model khác nhau.</td>
                                    </tr>
                                    <tr className="bg-background">
                                        <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">Nexus + Chatbox</td>
                                        <td className="py-3 px-4 text-muted-foreground">Ứng dụng desktop cực nhẹ, tốc độ cao, lưu lịch sử chat an toàn trên máy (local).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* TABS HƯỚNG DẪN */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">Hướng dẫn kết nối</h2>

                <Tabs defaultValue="openwebui" className="w-full mt-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12">
                        <TabsTrigger value="openwebui" className="text-base gap-2 cursor-pointer">
                            <Globe className="w-4 h-4" /> Open WebUI
                        </TabsTrigger>
                        <TabsTrigger value="chatbox" className="text-base gap-2 cursor-pointer">
                            <Smartphone className="w-4 h-4" /> Chatbox App
                        </TabsTrigger>
                    </TabsList>

                    {/* ==========================================
                        TAB 1: OPEN WEBUI
                    ========================================== */}
                    <TabsContent value="openwebui" className="space-y-8 animate-in slide-in-from-bottom-2">
                        <div className="space-y-8 pl-2 border-l-2 border-muted ml-3 mt-4">

                            {/* NÚT DOWNLOAD OPEN WEBUI */}
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Chưa có Open WebUI?</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Công cụ này thường được cài đặt thông qua Docker. Hãy xem hướng dẫn chính thức từ nhà phát triển.
                                    </p>
                                </div>
                                <a href="https://docs.openwebui.com/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <Globe className="w-4 h-4" /> Trang chủ Open WebUI
                                </a>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5 text-muted-foreground" /> Mở cài đặt Connections
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Đăng nhập vào Open WebUI, bấm vào avatar của bạn (hoặc menu Admin) chọn <strong>Settings</strong> ➜ Chuyển sang tab <strong>Connections</strong>.
                                </p>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <KeyRound className="w-5 h-5 text-muted-foreground" /> Khai báo OpenAI API
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-4">
                                    Trong mục OpenAI API, hãy điền thông tin máy chủ của Nexus vào:
                                </p>

                                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm max-w-2xl space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">API Base URL</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Xóa URL mặc định và dán: <code className="bg-muted px-1.5 py-0.5 rounded text-primary border border-border">https://api.nexus.com/api/v1</code>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">API Key</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Dán mã <code className="bg-muted px-1 py-0.5 rounded text-primary">sk-nexus-YOUR_KEY</code> của bạn vào ô mật khẩu.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-muted-foreground" /> Nhấn nút Verify (Xác thực)
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-3">
                                    Bấm vào biểu tượng <strong>Verify (Xác thực)</strong> bên cạnh ô API Key.
                                </p>
                                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-4 border border-emerald-200 dark:border-emerald-500/20 max-w-2xl">
                                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-start gap-2">
                                        <span className="mt-0.5 text-lg">✨</span>
                                        <span>
                                            <strong>Điều kỳ diệu sẽ xảy ra:</strong> Open WebUI sẽ tự động gọi lên Nexus và kéo về toàn bộ danh sách 30+ models hiện có. Bạn không cần phải gõ tay tên bất kỳ model nào! Bấm Save và bắt đầu chat thôi.
                                        </span>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </TabsContent>

                    {/* ==========================================
                        TAB 2: CHATBOX
                    ========================================== */}
                    <TabsContent value="chatbox" className="space-y-8 animate-in slide-in-from-bottom-2">
                        <div className="space-y-8 pl-2 border-l-2 border-muted ml-3 mt-4">

                            {/* NÚT DOWNLOAD CHATBOX */}
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Bạn chưa cài đặt Chatbox?</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Tải ứng dụng miễn phí hỗ trợ Windows, macOS, Linux, iOS và Android.
                                    </p>
                                </div>
                                <a href="https://chatboxai.app/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <Smartphone className="w-4 h-4" /> Tải Chatbox miễn phí
                                </a>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-muted-foreground" /> Mở Settings (Cài đặt)
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Mở ứng dụng Chatbox, bấm vào biểu tượng bánh răng (Settings) ở góc dưới cùng bên trái.
                                </p>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-muted-foreground" /> Chọn Model Provider "OpenAI API"
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-4">
                                    Trong mục <strong>AI Model Provider</strong>, hãy chọn <strong>OpenAI API</strong> (hoặc Custom OpenAI). Sau đó điền:
                                </p>

                                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm max-w-2xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-border/50">
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground w-1/3">API Host / API Domain</td>
                                                <td className="py-3"><code className="font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">https://api.nexus.com</code> <br /><span className="text-xs text-muted-foreground mt-1 block">(Lưu ý: Trên Chatbox thường không cần đuôi /api/v1)</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-semibold text-muted-foreground">API Key</td>
                                                <td className="py-3"><code className="font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">sk-nexus-YOUR_API_KEY</code></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="relative pl-6">
                                <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                                <h3 className="font-bold text-lg">Lưu và sử dụng</h3>
                                <p className="text-muted-foreground mt-1">
                                    Bấm <strong>Check</strong>. Bây giờ ở màn hình Chat chính, bạn chỉ cần sổ danh sách Model xuống là sẽ thấy Claude 3.5, GPT-5, Gemini hội tụ đầy đủ.
                                </p>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    );
}