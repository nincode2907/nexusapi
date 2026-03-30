"use client";

import React from "react";
import {
    Wallet, FileJson, Copy,
    PlayCircle, Key, Clock, CreditCard, Coins, CheckCircle2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BalanceApiDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Wallet className="w-3.5 h-3.5" /> Billing API
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Kiểm tra Số dư (Balance)</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                        API cho phép truy xuất số dư khả dụng và tổng chi phí đã sử dụng của tài khoản. Endpoint này được thiết kế tương thích với cấu trúc Billing phổ biến của OpenAI-style API, giúp các AI Client như Chatbox hoặc LobeChat có thể tự động nhận diện số dư.
                    </p>
                </div>

                <div className="bg-zinc-950 dark:bg-zinc-900 border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-x-auto shadow-sm">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded text-sm tracking-wider shrink-0">GET</span>
                    <code className="text-emerald-400 font-mono text-sm whitespace-nowrap">https://api.nexus.com/api/v1/user/balance</code>
                </div>

                {/* LƯU Ý BẢO MẬT */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl">
                    <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Yêu cầu xác thực (Authentication)</h4>
                        <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1">
                            Sử dụng Header <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Authorization: Bearer sk-nexus-xxx</code>. Key này chính là Key bạn dùng để gọi Chat API.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* EXAMPLE REQUEST */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" /> Ví dụ Request
                </h2>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden shadow-sm max-w-3xl">
                    <Tabs defaultValue="bash" className="w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-white/10 gap-3">
                            <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-lg h-auto gap-1">
                                <TabsTrigger value="bash" className="text-xs font-mono text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 rounded-md px-3 py-1.5">cURL</TabsTrigger>
                                <TabsTrigger value="js" className="text-xs font-mono text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-yellow-400 rounded-md px-3 py-1.5">Node.js</TabsTrigger>
                            </TabsList>
                            <button className="text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded hover:bg-zinc-800 transition-colors"><Copy className="w-3.5 h-3.5" /> Copy</button>
                        </div>

                        <TabsContent value="bash" className="p-4 m-0 overflow-x-auto">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">curl</span> <span className="text-yellow-300">"https://api.nexus.com/api/v1/user/balance"</span> \{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span>
                            </pre>
                        </TabsContent>

                        <TabsContent value="js" className="p-4 m-0 overflow-x-auto">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">const</span> fetchBalance = <span className="text-pink-400">async</span> () ={">"} {"{"}{'\n'}
                                {'  '}<span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-yellow-300">"https://api.nexus.com/api/v1/user/balance"</span>, {"{"}{'\n'}
                                {'    '}headers: {"{"} <span className="text-yellow-300">"Authorization"</span>: <span className="text-yellow-300">"Bearer sk-nexus-xxx"</span> {"}"}{'\n'}
                                {'  '}{"}"});{'\n'}
                                {'  '}<span className="text-pink-400">return</span> <span className="text-pink-400">await</span> response.<span className="text-blue-400">json</span>();{'\n'}
                                {"}"};
                            </pre>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* RESPONSE JSON */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <FileJson className="w-6 h-6 text-primary" /> Cấu trúc Trả về (Response)
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* JSON Khối */}
                    <div className="bg-zinc-950 rounded-xl border border-border/50 p-4 overflow-x-auto shadow-sm">
                        <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                            <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'  '}<span className="text-cyan-300">"object"</span>: <span className="text-yellow-300">"billing_balance"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"total_granted"</span>: <span className="text-orange-400">50.0</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"total_used"</span>: <span className="text-orange-400">12.568956</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"available_balance"</span>: <span className="text-emerald-400 font-bold">37.431044</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"currency"</span>: <span className="text-yellow-300">"CREDIT"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"last_updated"</span>: <span className="text-orange-400">1709543123</span>{'\n'}
                            <span className="text-yellow-300">{"}"}</span>
                        </pre>
                    </div>

                    {/* Giải thích chi tiết các trường quan trọng */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Giải thích các trường dữ liệu</h3>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">available_balance</p>
                                <p className="text-sm text-muted-foreground mt-1">Số dư khả dụng hiện tại của tài khoản. Các ứng dụng AI Client thường đọc trường này để hiển thị hạn mức cho phép người dùng thực hiện yêu cầu tiếp theo.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <Coins className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">total_granted <span className="text-foreground/50 font-sans font-normal">&amp;</span> total_used</p>
                                <p className="text-sm text-muted-foreground mt-1">Tổng số lượng Credit đã nạp vào tài khoản (<code className="text-xs bg-muted px-1 py-0.5 rounded">total_granted</code>) và tổng số lượng Credit đã tiêu thụ (<code className="text-xs bg-muted px-1 py-0.5 rounded">total_used</code>).</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">currency</p>
                                <p className="text-sm text-muted-foreground mt-1"> <code className="text-xs bg-muted px-1 py-0.5 rounded text-blue-500 font-bold">CREDIT</code> là đơn vị thanh toán nội bộ của Nexus. 1 CREDIT tương đương 25 VND giá trị sử dụng API.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <Clock className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">last_updated</p>
                                <p className="text-sm text-muted-foreground mt-1">Thời gian cập nhật số dư cuối cùng, định dạng Unix Timestamp (giây, UTC).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}