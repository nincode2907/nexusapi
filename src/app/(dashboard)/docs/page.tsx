"use client";

import React from "react";
import {
    Terminal, Zap, Globe, CreditCard, Code2, LifeBuoy,
    MessageCircle, Mail, KeyRound, Wallet, Cpu, MonitorSmartphone,
    ArrowRight, ArrowDown, Bot, Users, Blocks
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function DocsQuickStartPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">

            {/* 1. KHÁI NIỆM & HERO SECTION */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Bắt đầu với Nexus API</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Nexus API là AI Gateway giúp bạn truy cập hơn 30+ mô hình AI hàng đầu
                    (OpenAI, Anthropic, Google...) chỉ qua một endpoint duy nhất.
                    Tương thích hoàn toàn với OpenAI SDK. Giúp bạn tích hợp
                    <strong>  nhanh hơn
                        và tối ưu chi phí khi sử dụng nhiều model AI.</strong>
                </p>
                <div className="inline-block px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Bạn có thể gửi request đầu tiên chỉ trong vài phút.
                    </p>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 overflow-hidden shadow-inner">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-background border-2 border-border rounded-xl flex items-center justify-center shadow-sm">
                            <MonitorSmartphone className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold">Ứng dụng của bạn</span>
                    </div>

                    <ArrowRight className="w-6 h-6 text-muted-foreground/50 hidden md:block" />
                    <ArrowDown className="w-6 h-6 text-muted-foreground/50 md:hidden" />

                    <div className="flex flex-col items-center gap-3 relative group cursor-default">
                        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                            <Zap className="w-8 h-8" />
                            {/* Hiệu ứng đèn LED Ping báo server đang chạy */}
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background"></span>
                            </span>
                        </div>
                        <span className="text-sm font-extrabold text-primary">Nexus API</span>
                    </div>

                    <ArrowRight className="w-6 h-6 text-muted-foreground/50 hidden md:block" />
                    <ArrowDown className="w-6 h-6 text-muted-foreground/50 md:hidden" />

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-background border-2 border-border rounded-xl flex items-center justify-center shadow-sm">
                            <Bot className="w-7 h-7 text-indigo-500" />
                        </div>
                        <span className="text-sm font-semibold text-center leading-tight">
                            OpenAI / Claude <br /> Gemini / DeepSeek
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground text-lg">Nexus phù hợp với ai?</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <strong>Developer</strong> xây dựng chatbot, tool AI.</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <strong>Startup</strong> tích hợp AI vào sản phẩm nhanh chóng.</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <strong>Doanh nghiệp</strong> muốn tối ưu chi phí qua nhiều model AI.</li>
                        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <strong>Cá nhân</strong> thử nghiệm, học tập với các mô hình AI mới nhất.</li>
                    </ul>
                </div>

                <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Blocks className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-bold text-foreground text-lg">Không cần lập trình?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                        Nếu bạn không phải Developer, bạn vẫn có thể sử dụng Nexus dễ dàng thông qua các ứng dụng hoặc nền tảng tích hợp sẵn API (như Cursor, Open WebUI, Chatbox...).
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-foreground">🤖 Chatbot cá nhân</span>
                        <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-foreground">⚙️ Công cụ tự động hóa</span>
                        <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-foreground">🌐 Website AI</span>
                        <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-foreground">📚 Hệ thống RAG</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* 2. LỢI ĐIỂM BÁN HÀNG (USPs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <Globe className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-bold text-foreground mb-2">Một API - Mọi Model</h3>
                    <p className="text-sm text-muted-foreground">Không cần quản lý nhiều API Key từ các nhà cung cấp khác nhau.
                        Tất cả model AI đều được truy cập thông qua một endpoint duy nhất.</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <CreditCard className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-bold text-foreground mb-2">Thanh toán VNĐ Siêu Tốc</h3>
                    <p className="text-sm text-muted-foreground">Quét mã VietQR, hệ thống cộng Credit tự động trong 5 giây. Nạp bao nhiêu xài bấy nhiêu, không cần thẻ tín dụng quốc tế.</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <Code2 className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-bold text-foreground mb-2">Tương thích OpenAI 100%</h3>
                    <p className="text-sm text-muted-foreground">App của bạn đang chạy bằng thư viện OpenAI? Chỉ cần đổi duy nhất dòng <code className="text-xs bg-muted px-1 rounded">base_url</code>, mọi thứ hoạt động hoàn hảo.</p>
                </div>
            </div>

            {/* 3. VŨ KHÍ BÍ MẬT: Caching */}
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 flex items-start gap-3 shadow-sm">
                <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">Miễn phí Prompt Caching</h4>
                    <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mt-1.5 leading-relaxed">
                        Hệ thống tự động ghi nhớ các prompt đã gửi trước đó. Nếu bạn gửi lại cùng nội dung, <strong>chi phí token đầu vào
                            có thể giảm đến 90%</strong> và phản hồi nhanh hơn đáng kể. Tất cả được xử lý tự động, bạn không cần thay đổi code.
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* 3. BƯỚC CHUẨN BỊ (Onboarding) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-border pb-2">1. Bắt đầu trong 3 bước</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="relative p-5 bg-card border border-border/60 rounded-xl shadow-sm">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center shadow-md">1</div>
                        <h3 className="font-bold mb-2 ml-2 flex items-center gap-2"><KeyRound className="w-4 h-4 text-muted-foreground" /> Tạo API Key</h3>
                        <p className="text-sm text-muted-foreground ml-2">
                            Truy cập menu <Link href="/api-keys" className="text-primary hover:underline font-medium">API Keys</Link>. Bấm "Tạo API Key mới", copy và cất giữ cẩn thận (Key chỉ hiện 1 lần duy nhất).
                        </p>
                    </div>

                    <div className="relative p-5 bg-card border border-border/60 rounded-xl shadow-sm">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center shadow-md">2</div>
                        <h3 className="font-bold mb-2 ml-2 flex items-center gap-2"><Wallet className="w-4 h-4 text-muted-foreground" /> Nạp Credit</h3>
                        <p className="text-sm text-muted-foreground ml-2">
                            Nếu chưa có credits trong tài khoản, hãy nhập giftcode từ các chương trình khuyến mãi của chúng tôi. Hoặc vào menu <Link href="/billing" className="text-primary hover:underline font-medium">Thanh toán</Link> để nạp qua VietQR.
                        </p>
                    </div>

                    <div className="relative p-5 bg-card border border-border/60 rounded-xl shadow-sm">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center shadow-md">3</div>
                        <h3 className="font-bold mb-2 ml-2 flex items-center gap-2"><Cpu className="w-4 h-4 text-muted-foreground" /> Chọn Model</h3>
                        <p className="text-sm text-muted-foreground ml-2">
                            Vào <Link href="/models" className="text-primary hover:underline font-medium">Thư viện Model</Link> để lấy mã <code>model_id</code> (VD: <code>gpt-4o-mini</code>) điền vào request của bạn.
                        </p>
                    </div>

                </div>
            </div>

            {/* 4. BASE URL & REQUEST MẪU */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold border-b border-border pb-2">2. Cấu hình Base URL</h2>

                    <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg border border-border/50 overflow-hidden">
                        <div className="px-4 py-2 bg-zinc-900/50 border-b border-white/10">
                            <span className="text-xs font-mono text-zinc-400">Base URL</span>
                        </div>
                        <div className="p-4">
                            <code className="text-sm font-mono text-emerald-400">https://api.nexus.com/api/v1</code>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold border-b border-border pb-2">3. Gửi Request đầu tiên</h2>
                    <p className="text-muted-foreground">Đừng quên thay thế <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm font-mono">YOUR_API_KEY</code> bằng key thật của bạn tạo trong Dashboard.</p>

                    <Tabs defaultValue="python" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-4">
                            <TabsTrigger value="python" className="cursor-pointer">Python</TabsTrigger>
                            <TabsTrigger value="nodejs" className="cursor-pointer">Node.js</TabsTrigger>
                            <TabsTrigger value="curl" className="cursor-pointer">cURL</TabsTrigger>
                        </TabsList>

                        <TabsContent value="python">
                            <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg border border-border/50 overflow-hidden">
                                <div className="p-4 overflow-x-auto">
                                    <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                        <span className="text-purple-400">from</span> openai <span className="text-purple-400">import</span> OpenAI{'\n\n'}
                                        client = OpenAI({'\n'}
                                        {'    '}api_key=<span className="text-yellow-300">"YOUR_API_KEY"</span>,{'\n'}
                                        {'    '}<span className="text-emerald-400">base_url</span>=<span className="text-yellow-300">"https://api.nexus.com/api/v1"</span>{'\n'}
                                        ){'\n\n'}
                                        response = client.chat.completions.create({'\n'}
                                        {'    '}model=<span className="text-yellow-300">"gpt-4o-mini"</span>, <span className="text-zinc-500"># Tùy chỉnh model tại đây</span>{'\n'}
                                        {'    '}messages=[{'{'}<span className="text-yellow-300">"role"</span>: <span className="text-yellow-300">"user"</span>, <span className="text-yellow-300">"content"</span>: <span className="text-yellow-300">"Xin chào Nexus!"</span>{'}'}],{'\n'}
                                        {'    '}<span className="text-emerald-400">stream</span>=<span className="text-orange-400">True</span> <span className="text-zinc-500"># Streaming output</span>{'\n'}
                                        ){'\n\n'}
                                        <span className="text-purple-400">for</span> chunk <span className="text-purple-400">in</span> response:{'\n'}
                                        {'    '}<span className="text-purple-400">if</span> chunk.choices[<span className="text-orange-400">0</span>].delta.content <span className="text-purple-400">is not None</span>:{'\n'}
                                        {'        '}<span className="text-blue-400">print</span>(chunk.choices[<span className="text-orange-400">0</span>].delta.content, end=<span className="text-yellow-300">""</span>)
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="nodejs">
                            <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg border border-border/50 overflow-hidden">
                                <div className="p-4 overflow-x-auto">
                                    <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                        <span className="text-purple-400">import</span> OpenAI <span className="text-purple-400">from</span> <span className="text-yellow-300">"openai"</span>;{'\n\n'}
                                        <span className="text-purple-400">const</span> openai = <span className="text-purple-400">new</span> OpenAI({'{'}{'\n'}
                                        {'    '}apiKey: <span className="text-yellow-300">"YOUR_API_KEY"</span>,{'\n'}
                                        {'    '}baseURL: <span className="text-yellow-300">"https://api.nexus.com/api/v1"</span>{'\n'}
                                        {'}'});{'\n\n'}
                                        <span className="text-purple-400">async function</span> <span className="text-blue-400">main</span>() {'{'}{'\n'}
                                        {'    '}<span className="text-purple-400">const</span> stream = <span className="text-purple-400">await</span> openai.chat.completions.create({'{'}{'\n'}
                                        {'        '}model: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                                        {'        '}messages: [{'{'} role: <span className="text-yellow-300">"user"</span>, content: <span className="text-yellow-300">"Xin chào Nexus!"</span> {'}'}],{'\n'}
                                        {'        '}<span className="text-emerald-400">stream</span>: <span className="text-orange-400">true</span>{'\n'}
                                        {'    }'});{'\n\n'}
                                        {'    '}<span className="text-purple-400">for await</span> (<span className="text-purple-400">const</span> chunk <span className="text-purple-400">of</span> stream) {'{'}{'\n'}
                                        {'        '}process.stdout.<span className="text-blue-400">write</span>(chunk.choices[<span className="text-orange-400">0</span>]?.delta?.content || <span className="text-yellow-300">""</span>);{'\n'}
                                        {'    }'}{'\n'}
                                        {'}'}{'\n\n'}
                                        main();
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="curl">
                            <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg border border-border/50 overflow-hidden">
                                <div className="p-4 overflow-x-auto">
                                    <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                                        <span className="text-pink-400">curl</span> https://api.nexus.com/api/v1/chat/completions \{'\n'}
                                        {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Content-Type: application/json"</span> \{'\n'}
                                        {'  '}<span className="text-zinc-400">-H</span> <span className="text-yellow-300">"Authorization: Bearer YOUR_API_KEY"</span> \{'\n'}
                                        {'  '}<span className="text-zinc-400">-d</span> <span className="text-yellow-300">'{'{'}'</span>{'\n'}
                                        {'    '}<span className="text-cyan-300">"model"</span>: <span className="text-yellow-300">"gpt-4o-mini"</span>,{'\n'}
                                        {'    '}<span className="text-cyan-300">"messages"</span>: [{'{'} <span className="text-cyan-300">"role"</span>: <span className="text-yellow-300">"user"</span>, <span className="text-cyan-300">"content"</span>: <span className="text-yellow-300">"Xin chào Nexus!"</span> {'}'}],{'\n'}
                                        {'    '}<span className="text-cyan-300">"stream"</span>: <span className="text-orange-400">true</span>{'\n'}
                                        {'  '}<span className="text-yellow-300">{'}'}'</span>
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="w-full h-px bg-border/50 my-8" />

            {/* HỖ TRỢ & CỘNG ĐỒNG */}
            <div className="bg-muted/30 border border-border/50 rounded-xl p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <LifeBuoy className="w-5 h-5 text-primary" /> Cần hỗ trợ tích hợp?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Nếu bạn gặp khó khăn trong quá trình cấu hình API hoặc cần tư vấn chọn Model phù hợp, đội ngũ kỹ sư của Nexus luôn sẵn sàng hỗ trợ bạn 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#" className="flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" /> Zalo Hỗ trợ Kỹ thuật
                    </a>
                    <a href="mailto:support@nexus.com" className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        <Mail className="w-4 h-4" /> support@nexus.com
                    </a>
                </div>
            </div>

        </div>
    );
}