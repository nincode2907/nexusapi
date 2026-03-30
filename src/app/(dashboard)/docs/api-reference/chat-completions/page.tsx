"use client";

import React from "react";
import {
    Terminal, Braces, Send, Cpu,
    Zap, Activity, Code2, Layers, PlayCircle, Copy
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ChatCompletionsDocPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* HEADER & ENDPOINT */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Terminal className="w-3.5 h-3.5" /> API Reference
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Chat Completions</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                        Endpoint cốt lõi để giao tiếp với các mô hình ngôn ngữ (LLMs). Nó tiếp nhận một danh sách các tin nhắn hội thoại và trả về câu trả lời từ AI. Hoàn toàn tương thích với chuẩn OpenAI.
                    </p>
                </div>

                <div className="bg-zinc-950 dark:bg-zinc-900 border border-border/50 rounded-xl p-4 flex items-center gap-4 overflow-x-auto shadow-sm">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold rounded text-sm tracking-wider">POST</span>
                    <code className="text-emerald-400 font-mono text-sm whitespace-nowrap">https://api.nexus.com/api/v1/chat/completions</code>
                </div>
            </div>

            {/* BỔ SUNG: KHỐI TRY IT (VÍ DỤ REQUEST ĐẦY ĐỦ) */}
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
                                <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/chat/completions \{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span> \{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> \{'\n'}
                                {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">'{'{'}'</span>{'\n'}
                                {'    '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                                {'    '}<span className="text-cyan-300">"messages"</span>: [{'{'}<span className="text-cyan-300">"role"</span>:<span className="text-yellow-300">"user"</span>,<span className="text-cyan-300">"content"</span>:<span className="text-yellow-300">"Hello"</span>{'}'}]{'\n'}
                                {'  '}<span className="text-yellow-300">{'}'}'</span>
                            </pre>
                        </TabsContent>

                        {/* WINDOWS CMD */}
                        <TabsContent value="cmd" className="p-4 overflow-x-auto m-0">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/chat/completions <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer sk-nexus-xxx"</span> <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> <span className="text-zinc-500">^</span>{'\n'}
                                {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">"{'{'}\"model\": \"gpt-4o-mini\", \"messages\": [{'{'}\"role\":\"user\",\"content\":\"Hello\"{'}'}]{'}'}"</span>
                            </pre>
                        </TabsContent>

                        {/* NODE.JS */}
                        <TabsContent value="node" className="p-4 overflow-x-auto m-0">
                            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                <span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-yellow-300">'https://api.nexus.com/api/v1/chat/completions'</span>, {'{'}{'\n'}
                                {'  '}method: <span className="text-yellow-300">'POST'</span>,{'\n'}
                                {'  '}headers: {'{'}{'\n'}
                                {'    '}<span className="text-yellow-300">'Authorization'</span>: <span className="text-yellow-300">'Bearer sk-nexus-xxx'</span>,{'\n'}
                                {'    '}<span className="text-yellow-300">'Content-Type'</span>: <span className="text-yellow-300">'application/json'</span>{'\n'}
                                {'  '},{'\n'}
                                {'  '}body: <span className="text-blue-400">JSON</span>.<span className="text-emerald-300">stringify</span>({'{'}{'\n'}
                                {'    '}model: <span className="text-yellow-300">'gpt-4o-mini'</span>,{'\n'}
                                {'    '}messages: [{'{'} role: <span className="text-yellow-300">'user'</span>, content: <span className="text-yellow-300">'Hello'</span> {'}'}]{'\n'}
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
                <p className="text-muted-foreground">Request yêu cầu định dạng <code className="bg-muted px-1.5 py-0.5 rounded">application/json</code>.</p>

                <div className="space-y-4">
                    {/* Model */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground font-mono">model</h3>
                            <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Bắt buộc</span>
                            <span className="text-xs text-muted-foreground font-mono">string</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            ID của model bạn muốn sử dụng (Ví dụ: <code className="text-primary font-mono">gpt-4o-mini</code>, <code className="text-primary font-mono">claude-3-5-sonnet</code>). Xem danh sách đầy đủ tại menu Thư viện Model.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground font-mono">messages</h3>
                            <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Bắt buộc</span>
                            <span className="text-xs text-muted-foreground font-mono">array</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Mảng chứa lịch sử cuộc hội thoại. Mỗi tin nhắn là một object bao gồm 2 trường chính: <code className="font-mono">role</code> và <code className="font-mono">content</code>.
                        </p>

                        <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <code className="font-mono text-sm text-blue-500 font-semibold">"role": "system"</code>
                                <p className="text-sm text-muted-foreground md:col-span-3">Thiết lập tính cách, quy tắc hoặc bối cảnh cho AI (Ví dụ: "Bạn là một lập trình viên Python"). Thường đặt ở đầu mảng.</p>
                            </div>
                            <div className="w-full h-px bg-border/50" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <code className="font-mono text-sm text-emerald-500 font-semibold">"role": "user"</code>
                                <p className="text-sm text-muted-foreground md:col-span-3">Câu hỏi hoặc yêu cầu từ phía người dùng.</p>
                            </div>
                            <div className="w-full h-px bg-border/50" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <code className="font-mono text-sm text-purple-500 font-semibold">"role": "assistant"</code>
                                <p className="text-sm text-muted-foreground md:col-span-3">Câu trả lời trước đó của AI. Dùng để duy trì mạch ngữ cảnh hội thoại.</p>
                            </div>
                        </div>
                    </div>

                    {/* Temperature & Max Tokens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground font-mono">temperature</h3>
                                <span className="text-xs text-muted-foreground font-mono">number (Optional)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Kiểm soát độ sáng tạo. Giá trị từ <code className="font-mono">0.0</code> đến <code className="font-mono">2.0</code>. Mặc định là 1. Số càng cao câu trả lời càng đa dạng, số càng thấp AI càng trả lời máy móc và chính xác.
                            </p>
                        </div>

                        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground font-mono">max_tokens</h3>
                                <span className="text-xs text-muted-foreground font-mono">number (Optional)</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Giới hạn số token tối đa của phần trả lời  do AI sinh ra. Hữu ích khi bạn muốn AI trả lời ngắn gọn hoặc muốn kiểm soát chi phí đầu ra.
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
                    Khi request thành công (Status 200), API sẽ trả về một đối tượng JSON bao gồm câu trả lời của AI và thống kê chi tiết số token đã sử dụng.
                </p>

                <div className="bg-zinc-950 dark:bg-zinc-900 rounded-xl border border-border/50 overflow-hidden shadow-sm max-w-3xl">
                    <div className="flex items-center px-4 py-2 bg-zinc-900/50 border-b border-white/10 gap-2">
                        <Code2 className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-mono text-zinc-400">Response (200 OK)</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-sm font-mono leading-relaxed text-zinc-300">
                            <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'  '}<span className="text-cyan-300">"id"</span>: <span className="text-yellow-300">"chatcmpl-8xN..."</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"object"</span>: <span className="text-yellow-300">"chat.completion"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"created"</span>: <span className="text-orange-400">1709543123</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                            {'  '}<span className="text-cyan-300">"choices"</span>: [{'\n'}
                            {'    '}<span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'      '}<span className="text-cyan-300">"index"</span>: <span className="text-orange-400">0</span>,{'\n'}
                            {'      '}<span className="text-cyan-300">"message"</span>: <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'        '}<span className="text-cyan-300">"role"</span>: <span className="text-yellow-300">"assistant"</span>,{'\n'}
                            {'        '}<span className="text-cyan-300">"content"</span>: <span className="text-yellow-300">"Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"</span>{'\n'}
                            {'      '}<span className="text-yellow-300">{"}"}</span>,{'\n'}
                            {'      '}<span className="text-cyan-300">"finish_reason"</span>: <span className="text-yellow-300">"stop"</span>{'\n'}
                            {'    '}<span className="text-yellow-300">{"}"}</span>{'\n'}
                            {'  '}],{'\n'}
                            {'  '}<span className="text-cyan-300">"usage"</span>: <span className="text-yellow-300">{"{"}</span>{'\n'}
                            {'    '}<span className="text-cyan-300">"prompt_tokens"</span>: <span className="text-orange-400">12</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"completion_tokens"</span>: <span className="text-orange-400">15</span>,{'\n'}
                            {'    '}<span className="text-cyan-300">"total_tokens"</span>: <span className="text-orange-400">27</span>{'\n'}
                            {'  '}<span className="text-yellow-300">{"}"}</span>{'\n'}
                            <span className="text-yellow-300">{"}"}</span>
                        </pre>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* STREAMING (SSE) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-500" /> Hiệu ứng gõ từng chữ (Streaming)
                </h2>

                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-full shrink-0">
                            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="w-full">
                            <p className="text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed mb-3">
                                Để trải nghiệm AI mượt mà như ChatGPT, bạn chỉ cần truyền thêm tham số <code className="font-mono font-bold bg-emerald-200/50 dark:bg-emerald-800/50 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">"stream": true</code> vào cùng cấp với <code>model</code> và <code>messages</code> trong Request Body:
                            </p>

                            {/* MINH HỌA VỊ TRÍ ĐẶT STREAM */}
                            <div className="bg-zinc-950 rounded-lg p-3 border border-emerald-900/20 mb-4 overflow-x-auto">
                                <pre className="text-xs font-mono leading-relaxed text-zinc-300">
                                    <span className="text-yellow-300">{"{"}</span>{'\n'}
                                    {'  '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                                    {'  '}<span className="text-cyan-300">"messages"</span>: [{'{'}<span className="text-cyan-300">"role"</span>: <span className="text-yellow-300">"user"</span>, <span className="text-cyan-300">"content"</span>: <span className="text-yellow-300">"Hello"</span>{'}'}],{'\n'}
                                    {'  '}<span className="text-emerald-400 font-bold bg-emerald-900/40 px-1 rounded">"stream": true</span>{'\n'}
                                    <span className="text-yellow-300">{"}"}</span>
                                </pre>
                            </div>

                            <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed mb-3">
                                Thay vì đợi trả về một cục JSON khổng lồ, máy chủ Nexus sẽ gửi từng đoạn văn bản nhỏ ngay lập tức thông qua giao thức <strong>Server-Sent Events (SSE)</strong>. Giao diện của bạn có thể hứng dữ liệu và in ra màn hình ngay lập tức:
                            </p>

                            <div className="bg-zinc-950 rounded-lg p-4 border border-emerald-900/20 text-xs font-mono text-zinc-400 space-y-2 overflow-x-auto">
                                <p>data: {"{"}"id":"chatcmpl-123","choices":[{"{"}"delta":{"{"}"content":"Xin "{"}"}{"}"}]{"}"}</p>
                                <p>data: {"{"}"id":"chatcmpl-123","choices":[{"{"}"delta":{"{"}"content":"chào"{"}"}{"}"}]{"}"}</p>
                                <p>data: {"{"}"id":"chatcmpl-123","choices":[{"{"}"delta":{"{"}"content":"!"{"}"}{"}"}]{"}"}</p>
                                <p className="text-emerald-500 font-bold">data: [DONE]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}