"use client";

import React from "react";
import {
    Terminal, Braces, Send, Network,
    Database, Target, PlayCircle, Copy, Code2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function EmbeddingsDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER & ENDPOINT */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Terminal className="w-3.5 h-3.5" /> API Reference
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Create Embeddings</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                        API biến đổi văn bản (text) thành các vector số học (numerical vectors). Các vector này giúp hệ thống máy tính đo lường mức độ liên quan giữa các văn bản, cực kỳ hữu ích cho các tác vụ Tìm kiếm ngữ nghĩa (Semantic Search), Phân cụm (Clustering), và xây dựng hệ thống RAG.
                    </p>
                </div>

                <div className="bg-zinc-950 dark:bg-zinc-900 border border-border/50 rounded-xl p-4 flex items-center gap-4 overflow-x-auto shadow-sm">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold rounded text-sm tracking-wider">POST</span>
                    <code className="text-emerald-400 font-mono text-sm whitespace-nowrap">https://api.nexus.com/api/v1/embeddings</code>
                </div>
            </div>

            {/* VÍ DỤ REQUEST ĐẦY ĐỦ */}
            <div className="space-y-4 mt-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <PlayCircle className="w-5 h-5 text-primary" /> Ví dụ Request (Try it out)
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                    Đừng quên thêm Header <code>Authorization: Bearer &lt;API_KEY&gt;</code> để xác thực yêu cầu của bạn.
                </p>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden shadow-sm max-w-3xl relative group">
                    <Tabs defaultValue="bash" className="w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800 gap-3">
                            <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-lg h-auto gap-1">
                                <TabsTrigger value="bash" className="cursor-pointer text-xs font-mono text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 rounded-md px-3 py-1.5 transition-all">
                                    cURL (Mac/Linux)
                                </TabsTrigger>
                                <TabsTrigger value="cmd" className="cursor-pointer text-xs font-mono text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-400 rounded-md px-3 py-1.5 transition-all">
                                    cURL (Windows CMD)
                                </TabsTrigger>
                                <TabsTrigger value="node" className="cursor-pointer text-xs font-mono text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-yellow-400 rounded-md px-3 py-1.5 transition-all">
                                    Node.js
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* MAC / LINUX */}
                        <TabsContent value="bash" className="p-4 overflow-x-auto m-0">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/embeddings \{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span> \{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> \{'\n'}
                                {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">'{'{'}'</span>{'\n'}
                                {'    '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"text-embedding-3-small"</span>,{'\n'}
                                {'    '}<span className="text-cyan-300">"input"</span>: <span className="text-yellow-300">"AI Proxy Gateway là gì?"</span>{'\n'}
                                {'  '}<span className="text-yellow-300">{'}'}'</span>
                            </pre>
                        </TabsContent>

                        {/* WINDOWS CMD */}
                        <TabsContent value="cmd" className="p-4 overflow-x-auto m-0">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/embeddings <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span> <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">"{'{'}\"model\": \"text-embedding-3-small\", \"input\": \"AI Proxy Gateway là gì?\"{'}'}"</span>
                            </pre>
                        </TabsContent>

                        {/* NODE.JS */}
                        <TabsContent value="node" className="p-4 overflow-x-auto m-0">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-yellow-300">'https://api.nexus.com/api/v1/embeddings'</span>, {'{'}{'\n'}
                                {'  '}method: <span className="text-yellow-300">'POST'</span>,{'\n'}
                                {'  '}headers: {'{'}{'\n'}
                                {'    '}<span className="text-yellow-300">'Authorization'</span>: <span className="text-yellow-300">'Bearer sk-nexus-xxx'</span>,{'\n'}
                                {'    '}<span className="text-yellow-300">'Content-Type'</span>: <span className="text-yellow-300">'application/json'</span>{'\n'}
                                {'  '},{'\n'}
                                {'  '}body: <span className="text-blue-400">JSON</span>.<span className="text-emerald-300">stringify</span>({'{'}{'\n'}
                                {'    '}model: <span className="text-yellow-300">'text-embedding-3-small'</span>,{'\n'}
                                {'    '}input: <span className="text-yellow-300">'AI Proxy Gateway là gì?'</span>{'\n'}
                                {'  '}){'\n'}
                                {'}'});
                            </pre>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* REQUEST BODY (PARAMETERS) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <Braces className="w-6 h-6 text-primary" /> Tham số Request (Body)
                </h2>

                <div className="space-y-4">
                    {/* Model */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground font-mono">model</h3>
                            <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Bắt buộc</span>
                            <span className="text-xs text-muted-foreground font-mono">string</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            ID của mô hình Embedding (Ví dụ: <code className="text-primary font-mono">text-embedding-3-small</code>, <code className="text-primary font-mono">text-embedding-3-large</code>). Lưu ý: Bạn không thể dùng các mô hình Chat (như gpt-4o) cho endpoint này.
                        </p>
                    </div>

                    {/* Input */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground font-mono">input</h3>
                            <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Bắt buộc</span>
                            <span className="text-xs text-muted-foreground font-mono">string | array</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Văn bản cần mã hóa thành vector. Bạn có thể truyền một chuỗi (string) đơn lẻ, hoặc một mảng các chuỗi (array of strings) để xử lý nhiều câu cùng một lúc, giúp tiết kiệm thời gian gọi API.
                        </p>
                    </div>

                    {/* Optional Params */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground font-mono">encoding_format</h3>
                                <span className="text-xs text-muted-foreground font-mono">string (Optional)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Định dạng của mảng vector trả về. Có 2 giá trị: <code className="font-mono">float</code> (mặc định) hoặc <code className="font-mono">base64</code> (dùng cho các hệ thống cần tối ưu dung lượng băng thông).
                            </p>
                        </div>

                        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground font-mono">dimensions</h3>
                                <span className="text-xs text-muted-foreground font-mono">number (Optional)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Giới hạn số chiều (dimensions) của vector đầu ra. Chỉ hỗ trợ trên các mô hình đời mới như <code>text-embedding-3</code>. Giúp tiết kiệm chi phí lưu trữ Vector DB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* RESPONSE STRUCTURE */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <Send className="w-6 h-6 text-primary" /> Cấu trúc Trả về (Response)
                </h2>
                <p className="text-muted-foreground">
                    API sẽ trả về một mảng <code className="font-mono">data</code> chứa các Vector số thực (floating-point numbers). Mảng này đại diện cho ý nghĩa của văn bản bạn đã gửi.
                </p>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden shadow-sm max-w-3xl">
                    <div className="flex items-center px-4 py-2 bg-zinc-900/50 border-b border-white/10 gap-2">
                        <Code2 className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-mono text-zinc-400">Response (200 OK)</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-sm font-mono leading-relaxed text-zinc-300">
                            <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'  '}<span className="text-cyan-300">"object"</span>: <span className="text-yellow-300">"list"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"data"</span>: [{'\n'}
                            {'    '}<span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'      '}<span className="text-cyan-300">"object"</span>: <span className="text-yellow-300">"embedding"</span>,{'\n'}
                            {'      '}<span className="text-cyan-300">"index"</span>: <span className="text-orange-400">0</span>,{'\n'}
                            {'      '}<span className="text-cyan-300">"embedding"</span>: [{'\n'}
                            {'        '}<span className="text-orange-400">-0.0069292834</span>,{'\n'}
                            {'        '}<span className="text-orange-400">-0.0053364220</span>,{'\n'}
                            {'        '}<span className="text-orange-400">-0.0000454713</span>,{'\n'}
                            {'        '}<span className="text-zinc-500">... (hàng ngàn con số khác)</span>{'\n'}
                            {'      '}]{'\n'}
                            {'    '}<span className="text-yellow-300">{"}"}</span>{'\n'}
                            {'  '}],{'\n'}
                            {'  '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"text-embedding-3-small"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"usage"</span>: <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'    '}<span className="text-cyan-300">"prompt_tokens"</span>: <span className="text-orange-400">14</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"total_tokens"</span>: <span className="text-orange-400">14</span>{'\n'}
                            {'  '}<span className="text-yellow-300">{"}"}</span>{'\n'}
                            <span className="text-yellow-300">{"}"}</span>
                        </pre>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* USE CASES & NOTES (THAY THẾ CHO STREAMING BÊN CHAT) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <Network className="w-6 h-6 text-purple-500" /> Ứng dụng & Cấu trúc Dữ liệu
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="font-bold text-purple-900 dark:text-purple-300">Khoảng cách ngữ nghĩa (Cosine Similarity)</h3>
                        </div>
                        <p className="text-sm text-purple-800/80 dark:text-purple-400/80 leading-relaxed">
                            Mảng Vector trả về không phải là chữ. Bạn cần dùng các thuật toán toán học (như Cosine Similarity) để tính khoảng cách giữa 2 mảng Vector. Khoảng cách càng gần nhau, hai đoạn văn bản càng có ý nghĩa giống nhau. Cực kỳ hữu dụng để làm tính năng "Bài viết liên quan" hoặc "Tìm kiếm thông minh".
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="font-bold text-purple-900 dark:text-purple-300">Lưu trữ vào Vector Database</h3>
                        </div>
                        <p className="text-sm text-purple-800/80 dark:text-purple-400/80 leading-relaxed">
                            Để hệ thống xử lý hàng triệu văn bản, bạn không nên lưu Vector vào cơ sở dữ liệu SQL thông thường (như MySQL/PostgreSQL). Hãy sử dụng các hệ thống Vector DB chuyên dụng như <strong>Pinecone</strong>, <strong>Qdrant</strong>, hoặc <strong>Milvus</strong> để lưu trữ kết quả đầu ra của API này.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}