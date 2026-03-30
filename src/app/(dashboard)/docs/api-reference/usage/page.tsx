"use client";

import React from "react";
import {
    Activity, FileJson, ListOrdered,
    Copy, PlayCircle, Key, Database, Clock, Calculator
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UsageApiDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Activity className="w-3.5 h-3.5" /> Management API
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Lịch sử sử dụng (Usage Logs)</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                        Truy xuất danh sách chi tiết các yêu cầu (requests) đã thực hiện qua API. Hỗ trợ phân trang, lọc theo thời gian và trả về thống kê token/chi phí đã được chuẩn hóa để bạn dễ dàng tích hợp vào hệ thống đối soát nội bộ.
                    </p>
                </div>

                <div className="bg-zinc-950 dark:bg-zinc-900 border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-x-auto shadow-sm">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded text-sm tracking-wider shrink-0">GET</span>
                    <code className="text-emerald-400 font-mono text-sm whitespace-nowrap">https://api.nexus.com/api/v1/user/usage</code>
                </div>

                {/* LƯU Ý BẢO MẬT */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl">
                    <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Yêu cầu xác thực (Authentication)</h4>
                        <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1">
                            Sử dụng Header <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Authorization: Bearer sk-nexus-xxx</code>. Key này chính là Key bạn dùng để gọi Chat API, không cần tạo Key Management riêng.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* QUERY PARAMETERS */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ListOrdered className="w-6 h-6 text-primary" /> Tham số truy vấn (Query Params)
                </h2>
                <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                            <tr>
                                <th className="px-4 py-3 w-32">Tham số</th>
                                <th className="px-4 py-3 w-24">Kiểu</th>
                                <th className="px-4 py-3 w-24">Mặc định</th>
                                <th className="px-4 py-3">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-primary font-semibold">limit</td>
                                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">number</td>
                                <td className="px-4 py-3 font-mono text-xs">20</td>
                                <td className="px-4 py-3 text-muted-foreground">Số lượng bản ghi trả về trên mỗi trang. Tối đa: <code className="text-foreground">100</code>.</td>
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-primary font-semibold">page</td>
                                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">number</td>
                                <td className="px-4 py-3 font-mono text-xs">1</td>
                                <td className="px-4 py-3 text-muted-foreground">Trang dữ liệu muốn truy cập.</td>
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-primary font-semibold">days</td>
                                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">number</td>
                                <td className="px-4 py-3 font-mono text-xs">30</td>
                                <td className="px-4 py-3 text-muted-foreground">Phạm vi thời gian tìm kiếm (Tính bằng số ngày gần nhất).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

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
                                <span className="text-pink-400">curl</span> <span className="text-yellow-300">"https://api.nexus.com/api/v1/management/usage?limit=20&page=1&days=7"</span> \{'\n'}
                                {' '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span>
                            </pre>
                        </TabsContent>
                        <TabsContent value="js" className="p-4 m-0 overflow-x-auto">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">const</span> fetchUsage = <span className="text-pink-400">async</span> () ={">"} {"{"} {'\n'}
                                {' '}<span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-yellow-300">"https://api.nexus.com/api/v1/management/usage?limit=20&page=1"</span>, {"{"} {'\n'}
                                {' '}<span className="text-yellow-300">headers</span>: {"{"} <span className="text-yellow-300">"Authorization"</span>: <span className="text-yellow-300">"Bearer sk-nexus-xxx"</span> {"}"} {'\n'}
                                {' '}{"}"}); {'\n'}
                                {' '}<span className="text-pink-400">return</span> <span className="text-pink-400">await</span> response.<span className="text-blue-400">json</span>(); {'\n'}
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
                            <span className="text-yellow-300">{"{"}</span> {'\n'}
                            {' '}<span className="text-cyan-300">"object"</span>: <span className="text-yellow-300">"list"</span>, {'\n'}
                            {' '}<span className="text-cyan-300">"data"</span>: [ {'\n'}
                            {' '} {' '}<span className="text-yellow-300">{"{"}</span> {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"id"</span>: <span className="text-yellow-300">"cmn37h7oq0001t9oc1hoegnf3"</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"createdAt"</span>: <span className="text-yellow-300">"2026-03-23T13:12:42.789Z"</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"modelName"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"promptTokens"</span>: <span className="text-orange-400">20</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"completionTokens"</span>: <span className="text-orange-400">169</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"totalTokens"</span>: <span className="text-emerald-400 font-bold">189</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"totalCostCredit"</span>: <span className="text-orange-400">0.169128</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"duration"</span>: <span className="text-orange-400">5777</span>, {'\n'}
                            {' '} {' '} {' '}<span className="text-cyan-300">"statusCode"</span>: <span className="text-orange-400">200</span> {'\n'}
                            {' '} <span className="text-yellow-300">{"}"}</span> {'\n'}
                            ], {'\n'}
                            {' '}<span className="text-cyan-300">"pagination"</span>: <span className="text-yellow-300">{"{"}</span> {'\n'}
                            {' '} {' '}<span className="text-cyan-300">"current_page"</span>: <span className="text-orange-400">1</span>, {'\n'}
                            {' '} {' '}<span className="text-cyan-300">"limit"</span>: <span className="text-orange-400">20</span>, {'\n'}
                            {' '} {' '}<span className="text-cyan-300">"total_records"</span>: <span className="text-orange-400">32</span>, {'\n'}
                            {' '} {' '}<span className="text-cyan-300">"total_pages"</span>: <span className="text-orange-400">2</span>, {'\n'}
                            {' '} {' '}<span className="text-cyan-300">"has_more"</span>: <span className="text-blue-400">true</span> {'\n'}
                            <span className="text-yellow-300">{"}"}</span>
                            <span className="text-yellow-300">{"}"}</span>
                        </pre>
                    </div>

                    {/* Giải thích chi tiết các trường quan trọng */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Giải thích các trường dữ liệu</h3>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <Calculator className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">totalTokens</p>
                                <p className="text-sm text-muted-foreground mt-1">Tổng số lượng Token đã sử dụng (bao gồm Prompt + Completion). Được tính toán sẵn giúp bạn không cần phải tự cộng.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <Database className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">totalCostCredit</p>
                                <p className="text-sm text-muted-foreground mt-1">Chi phí thực tế của Request tính bằng Credit. Đã được làm tròn tối đa 6 chữ số thập phân (ví dụ: <code className="text-xs bg-muted px-1 py-0.5 rounded">0.169128</code>) để tránh lỗi số học.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">duration</p>
                                <p className="text-sm text-muted-foreground mt-1">Tổng thời gian xử lý yêu cầu tính bằng mili-giây (ms).</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <ListOrdered className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold font-mono text-primary">pagination.has_more</p>
                                <p className="text-sm text-muted-foreground mt-1">Trả về <code className="text-xs bg-muted px-1 py-0.5 rounded text-blue-500 font-bold">true</code> nếu vẫn còn dữ liệu ở các trang tiếp theo. Rất tiện lợi để lập trình tính năng "Tải thêm" (Load More).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}