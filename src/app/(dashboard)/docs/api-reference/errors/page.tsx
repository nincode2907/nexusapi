"use client";

import React from "react";
import {
    AlertOctagon, Terminal, FileJson,
    ShieldAlert, Ban, Activity, ServerCrash, RefreshCw, FileQuestion
} from "lucide-react";

export default function ErrorHandlingDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <AlertOctagon className="w-3.5 h-3.5" /> Error Handling
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Xử lý Mã lỗi</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                        Nexus API sử dụng các mã trạng thái HTTP tiêu chuẩn (HTTP Status Codes) để chỉ thị sự thành công hay thất bại của một yêu cầu. Mọi lỗi trả về đều tuân thủ nghiêm ngặt cấu trúc Error Object của OpenAI.
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* ERROR OBJECT FORMAT */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <FileJson className="w-6 h-6 text-primary" /> Cấu trúc JSON báo lỗi
                </h2>
                <p className="text-muted-foreground">
                    Khi một yêu cầu thất bại (HTTP status code từ 400 trở lên), API sẽ trả về một đối tượng JSON có thuộc tính <code className="bg-muted px-1.5 py-0.5 rounded text-red-500 border border-border">error</code> chứa thông tin chi tiết giúp bạn dễ dàng debug.
                </p>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-red-900/30 overflow-hidden shadow-sm max-w-3xl relative">
                    <div className="flex items-center px-4 py-2 bg-red-950/30 border-b border-red-900/30 gap-2">
                        <Terminal className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-mono text-red-400">Response (Ví dụ lỗi 401)</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-sm font-mono leading-relaxed text-zinc-300">
                            <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'  '}<span className="text-cyan-300">"error"</span>: <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'    '}<span className="text-cyan-300">"message"</span>: <span className="text-yellow-300">"Incorrect API key provided: sk-nexus-xxx."</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"type"</span>: <span className="text-yellow-300">"invalid_request_error"</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"param"</span>: <span className="text-blue-400">null</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"code"</span>: <span className="text-yellow-300">"invalid_api_key"</span>{'\n'}
                            {'  '}<span className="text-yellow-300">{"}"}</span>{'\n'}
                            <span className="text-yellow-300">{"}"}</span>
                        </pre>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* COMMON ERROR CODES */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-orange-500" /> Bảng Mã lỗi phổ biến
                </h2>
                <p className="text-muted-foreground mb-6">
                    Dưới đây là các mã lỗi thường gặp nhất khi tương tác với Nexus API và cách khắc phục:
                </p>

                <div className="space-y-4">
                    {/* 400 Bad Request */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-orange-500/30 transition-colors">
                        <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            400
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1">Bad Request (Yêu cầu không hợp lệ)</h3>
                            <p className="text-sm text-muted-foreground mb-2">Request Body bị sai định dạng JSON, hoặc thiếu tham số bắt buộc (ví dụ thiếu mảng <code>messages</code>).</p>
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-500/10 inline-flex px-2 py-1 rounded border border-orange-200 dark:border-orange-500/20">
                                👉 Cách fix: Kiểm tra kỹ lại cú pháp JSON và các trường bắt buộc trong tài liệu API.
                            </div>
                        </div>
                    </div>

                    {/* 401 Unauthorized */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-red-500/30 transition-colors">
                        <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            401
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1">Unauthorized (Lỗi xác thực)</h3>
                            <p className="text-sm text-muted-foreground mb-2">Không tìm thấy API Key trong Header, hoặc API Key bị sai, đã bị xóa, hoặc không thuộc về hệ thống Nexus.</p>
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-500/10 inline-flex px-2 py-1 rounded border border-red-200 dark:border-red-500/20">
                                👉 Cách fix: Đảm bảo bạn đã truyền Header: Authorization: Bearer sk-nexus-xxx
                            </div>
                        </div>
                    </div>

                    {/* 402 Insufficient Quota */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-yellow-500/30 transition-colors">
                        <div className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            402
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                                Payment Required (Hết số dư)
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">Tài khoản của bạn đã sử dụng hết số dư (Credit) khả dụng hoặc đã vượt quá hạn mức chi tiêu cho phép.</p>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-500/10 inline-flex px-2 py-1 rounded border border-yellow-200 dark:border-yellow-500/20">
                                👉 Cách fix: Truy cập Dashboard và nạp thêm tiền vào tài khoản để tiếp tục sử dụng.
                            </div>
                        </div>
                    </div>

                    {/* 403 Forbidden */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-purple-500/30 transition-colors">
                        <div className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            403
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                                Forbidden (Từ chối truy cập) <Ban className="w-4 h-4 text-purple-500" />
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">API Key của bạn hợp lệ nhưng không có quyền truy cập vào tài nguyên này (ví dụ: IP của bạn bị hệ thống chặn, hoặc model bị giới hạn phân quyền).</p>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-500/10 inline-flex px-2 py-1 rounded border border-purple-200 dark:border-purple-500/20">
                                👉 Cách fix: Kiểm tra lại quyền hạn hoặc liên hệ Admin hỗ trợ.
                            </div>
                        </div>
                    </div>

                    {/* 404 Not Found */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-pink-500/30 transition-colors">
                        <div className="bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            404
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                                Model Not Found (Không tìm thấy) <FileQuestion className="w-4 h-4 text-pink-500" />
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">Model bạn yêu cầu không tồn tại, bạn gõ sai chính tả, hoặc model đó chưa được Nexus hỗ trợ.</p>
                            <div className="text-xs text-pink-600 dark:text-pink-400 font-medium bg-pink-50 dark:bg-pink-500/10 inline-flex px-2 py-1 rounded border border-pink-200 dark:border-pink-500/20">
                                👉 Cách fix: Kiểm tra kỹ lại tên model (VD: gpt-4o-mini thay vì gpt-4-mini).
                            </div>
                        </div>
                    </div>

                    {/* 429 Too Many Requests */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-blue-500/30 transition-colors">
                        <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            429
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                                Too Many Requests (Vượt giới hạn) <Activity className="w-4 h-4 text-blue-500" />
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">Bạn đang gửi quá nhiều requests trong một khoảng thời gian ngắn (Vượt quá RPM quy định cho hạng tài khoản của bạn).</p>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-500/10 inline-flex px-2 py-1 rounded border border-blue-200 dark:border-blue-500/20">
                                👉 Cách fix: Chậm lại! Sử dụng cơ chế Exponential Backoff để thử lại sau vài giây.
                            </div>
                        </div>
                    </div>

                    {/* 500 / 502 Server Errors */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:border-zinc-500/30 transition-colors">
                        <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold font-mono px-3 py-1 rounded-md text-lg min-w-[70px] text-center shrink-0">
                            50x
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                                Server Errors (Lỗi máy chủ) <ServerCrash className="w-4 h-4 text-zinc-500" />
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">Các lỗi từ 500 đến 504. Lỗi này thường xảy ra do server của Nexus quá tải, hoặc server của nhà cung cấp gốc (OpenAI, Anthropic) đang gặp sự cố đứt cáp/sập nguồn.</p>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-800 inline-flex px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700">
                                👉 Cách fix: Tự động thử lại (Retry) sau vài phút. Lỗi này không nằm ở code của bạn.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TIP BẮT LỖI MƯỢT MÀ VỚI PSEUDO-CODE */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-6 shadow-sm mt-8">
                <div className="flex items-start gap-4 flex-col sm:flex-row">
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-full shrink-0 mt-1 hidden sm:block">
                        <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="w-full">
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 sm:hidden" /> Lời khuyên: Exponential Backoff
                        </h3>
                        <p className="text-sm text-blue-800/80 dark:text-blue-400/80 leading-relaxed mb-4">
                            Để ứng dụng của bạn bền bỉ (không bị crash) khi gặp lỗi <strong>429 (Rate Limit)</strong> hoặc <strong>50x</strong>, bạn nên luôn sử dụng khối <code className="font-mono bg-blue-200/50 dark:bg-blue-800/50 px-1 py-0.5 rounded">try...catch</code>. Hãy áp dụng thuật toán tăng dần thời gian chờ kết hợp với việc đọc Header <code className="font-mono font-bold bg-blue-200/50 dark:bg-blue-800/50 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300">Retry-After</code> trả về từ API thay vì gửi request dồn dập ngay lập tức.
                        </p>

                        <div className="bg-zinc-950 rounded-lg p-4 border border-blue-900/20 text-xs font-mono text-zinc-300 space-y-2 overflow-x-auto">
                            <p className="text-zinc-500 italic"># 1. Cơ chế lùi thời gian chờ (Pseudo-code)</p>
                            <p>Lần thử 1 thất bại (Lỗi 429) ➔ Chờ <span className="text-emerald-400 font-bold">1s</span> ➔ Gọi lại API</p>
                            <p>Lần thử 2 thất bại (Lỗi 429) ➔ Chờ <span className="text-emerald-400 font-bold">2s</span> ➔ Gọi lại API</p>
                            <p>Lần thử 3 thất bại (Lỗi 429) ➔ Chờ <span className="text-emerald-400 font-bold">4s</span> ➔ Gọi lại API</p>
                            <p>Lần thử 4 thất bại (Lỗi 429) ➔ Chờ <span className="text-emerald-400 font-bold">8s</span> ➔ Gọi lại API</p>

                            <div className="w-full h-px bg-zinc-800 my-3"></div>

                            <p className="text-zinc-500 italic"># 2. Đọc Header từ Response API (Ưu tiên cao nhất)</p>
                            <p className="text-yellow-300">Retry-After: 2 <span className="text-zinc-500 italic"> // Hệ thống thông báo chính xác: "Hãy chờ 2 giây rồi gọi lại"</span></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}