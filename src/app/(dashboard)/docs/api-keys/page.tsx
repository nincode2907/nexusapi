"use client";

import React from "react";
import {
    KeyRound, ShieldAlert, PlusCircle, Trash2,
    CheckCircle2, AlertTriangle, Copy, ShieldCheck,
    Tags, Terminal, FileCode2
} from "lucide-react";
import Link from "next/link";

export default function ApiKeysDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Xác thực & API Key</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    API Key đóng vai trò như "chìa khóa nhà" của bạn trên hệ thống Nexus. <span className="font-bold">Bất kỳ ai</span> sở hữu API Key đều có thể gửi request và <span className="font-bold">sử dụng Credit</span> trong tài khoản của bạn. Hãy bảo mật nó tuyệt đối.
                </p>
            </div>

            {/* CẢNH BÁO BẢO MẬT (Màu Đỏ/Destructive) */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-5 flex items-start gap-3 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                    <h4 className="font-bold text-red-900 dark:text-red-400 text-lg">Lưu ý bảo mật quan trọng</h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-red-800/90 dark:text-red-300/90 list-disc list-inside">
                        <li><strong>Key chỉ hiển thị 1 LẦN DUY NHẤT</strong> ngay sau khi bạn tạo. Chúng tôi không lưu trữ Key gốc của bạn trên Database.</li>
                        <li>Nếu bạn làm mất hoặc quên Key, bạn không thể xem lại. Cách duy nhất là xóa Key cũ và tạo Key mới.</li>
                        <li><strong>Tuyệt đối không</strong> commit API Key lên GitHub (kể cả repo private) hoặc chia sẻ công khai trên mạng.</li>
                    </ul>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* HƯỚNG DẪN TẠO KEY (Steps) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">Hướng dẫn tạo API Key mới</h2>

                <div className="space-y-8 pl-2 border-l-2 border-muted ml-3">

                    {/* Step 1 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">1</div>
                        <h3 className="font-bold text-lg">Truy cập trang Quản lý</h3>
                        <p className="text-muted-foreground mt-1">
                            Mở menu <Link href="/api-keys" className="text-primary hover:underline font-medium">API Keys</Link> ở thanh công cụ bên trái. Trang này sẽ hiển thị toàn bộ các Key bạn đang có.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">2</div>
                        <h3 className="font-bold text-lg">Tạo Key & Đặt tên</h3>
                        <p className="text-muted-foreground mt-1 mb-3">
                            Bấm vào nút <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md mx-1"><PlusCircle className="w-3.5 h-3.5" /> Tạo API Key mới</span>. Hệ thống sẽ yêu cầu bạn nhập tên (Ví dụ: <em>"Project Cursor", "Chatbot Công ty"</em>).
                        </p>
                    </div>

                    {/* Step 3 (Kèm UI Mockup) */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 bg-background border-2 border-primary text-primary font-bold rounded-full flex items-center justify-center">3</div>
                        <h3 className="font-bold text-lg">Sao chép và Lưu trữ</h3>
                        <p className="text-muted-foreground mt-1 mb-4">
                            Ngay sau khi tạo, một hộp thoại chứa mã Key sẽ hiện lên. Hãy bấm nút Copy và lưu ngay vào Note hoặc file <code>.env</code> của bạn.
                        </p>

                        {/* MOCKUP UI COPY KEY */}
                        <div className="bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 rounded-lg p-5 max-w-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-zinc-100 font-semibold">API Key đã được tạo thành công!</span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-3">Hãy copy mã dưới đây. Nó sẽ không bao giờ hiển thị lại nữa.</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-black text-emerald-400 px-3 py-2.5 rounded border border-zinc-800 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                    sk-nexus-T4x9Lp2... (Mã bí mật)
                                </code>
                                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2.5 rounded transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Copy className="w-4 h-4" /> Copy
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="w-full h-px bg-border/50" />

            {/* CÁCH SỬ DỤNG API KEY */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">Ví dụ sử dụng API Key</h2>
                <p className="text-muted-foreground">
                    Để xác thực, bạn cần truyền API Key vào Header của HTTP Request dưới dạng <code>Authorization: Bearer &lt;TOKEN&gt;</code>.
                </p>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden max-w-3xl shadow-sm">
                    <div className="flex items-center px-4 py-2 bg-zinc-900/50 border-b border-white/10 gap-2">
                        <Terminal className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-mono text-zinc-400">cURL Request</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                            <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/chat/completions \{'\n'}
                            {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxxxx"</span> \{'\n'}
                            {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> \{'\n'}
                            {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">'{'{'}'</span>{'\n'}
                            {'    '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"messages"</span>: [{'{'}<span className="text-cyan-300">"role"</span>: <span className="text-yellow-300">"user"</span>, <span className="text-cyan-300">"content"</span>: <span className="text-yellow-300">"Xin chào"</span>{'}'}]{'\n'}
                            {'  '}<span className="text-yellow-300">{'}'}'</span>
                        </pre>
                    </div>
                </div>
            </div>


            <div className="w-full h-px bg-border/50" />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">Thực hành Tốt nhất (Best Practices)</h2>

                {/* Lưới 3 cột để nhét vừa khối .env */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* BỔ SUNG: KHỐI LƯU TRỮ API KEY AN TOÀN */}
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <FileCode2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="font-bold text-emerald-900 dark:text-emerald-300">Lưu trữ an toàn (.env)</h3>
                        </div>
                        <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mb-4">
                            Chúng tôi khuyến nghị lưu API Key trong biến môi trường thay vì hardcode trực tiếp trong source code.
                        </p>
                        <div className="bg-zinc-950 rounded-lg p-3 border border-emerald-900/20">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">.env</span>
                            <code className="text-sm text-emerald-400 font-mono">NEXUS_API_KEY=sk-nexus-xxxx</code>
                        </div>
                    </div>

                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Tags className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-foreground">Tạo nhiều Key cho nhiều dự án</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Thay vì dùng 1 Key cho mọi thứ, hãy tạo các Key riêng biệt (VD: 1 key cho Cursor, 1 key cho Tool Auto, 1 key cho Website).
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Lợi ích:</strong> Giúp bạn dễ dàng theo dõi xem dự án nào đang ngốn nhiều tiền nhất trên bảng Thống kê.
                        </p>
                    </div>

                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Trash2 className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-foreground">Thu hồi (Xóa) Key bị lộ</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Nếu bạn nghi ngờ API Key đã bị lộ, hãy thu hồi (revoke) key đó ngay lập tức hoặc báo cáo với chúng tôi để được hỗ trợ thu hồi.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Hành động:</strong> Vào trang Quản lý API Key, bấm icon Thùng rác bên cạnh Key đó để khóa vĩnh viễn. Các request dùng Key cũ sẽ bị từ chối ngay lập tức.
                        </p>
                    </div>
                </div>
            </div>

            {/* HINT SỬ DỤNG */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">Định dạng Key của Nexus</h4>
                    <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1">
                        Tất cả API Key hợp lệ của hệ thống đều bắt đầu bằng tiền tố <code>sk-nexus-</code>. Tiền tố này giúp bạn dễ dàng nhận diện key của Nexus
                        và tránh nhầm lẫn với các API key từ dịch vụ khác. Hãy đảm bảo bạn copy đầy đủ toàn bộ chuỗi ký tự này khi tích hợp vào các công cụ.
                    </p>
                </div>
            </div>

        </div>
    );
}