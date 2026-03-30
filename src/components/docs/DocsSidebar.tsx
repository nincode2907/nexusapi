"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Plug, Code2, Rocket } from "lucide-react";

const MENU_ITEMS = [
    {
        title: "Bắt đầu nhanh",
        icon: <Rocket className="w-4 h-4" />,
        items: [
            { title: "Giới thiệu Nexus API", href: "/docs" },
            { title: "Lấy API Key", href: "/docs/api-keys" },
        ],
    },
    {
        title: "Tích hợp Ứng dụng",
        icon: <Plug className="w-4 h-4" />,
        items: [
            { title: "OpenClaw 🔥", href: "/docs/integrations/openclaw" },
            { title: "Cursor & Cline", href: "/docs/integrations/cursor-cline" },
            { title: "Open WebUI & Chatbox", href: "/docs/integrations/chat-ui" },
        ],
    },
    {
        title: "Tài liệu API Reference",
        icon: <Code2 className="w-4 h-4" />,
        items: [
            { title: "Chat Completions", href: "/docs/api-reference/chat-completions" },
            { title: "Embeddings", href: "/docs/api-reference/embeddings" },
            { title: "Mã lỗi (Errors)", href: "/docs/api-reference/errors" },
            { title: "Kiểm tra Số dư (Free)", href: "/docs/api-reference/balance" },
            { title: "Lịch sử sử dụng", href: "/docs/api-reference/usage" },
        ],
    },
    {
        title: "Tối ưu & Nâng cao",
        icon: <Zap className="w-4 h-4" />,
        items: [
            { title: "Prompt Caching", href: "/docs/advanced/caching" },
        ],
    },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="space-y-8 pl-2">
            {MENU_ITEMS.map((group, idx) => (
                <div key={idx} className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <span className="p-1 rounded-md bg-muted/50 text-muted-foreground">{group.icon}</span>
                        {group.title}
                    </h3>
                    <ul className="space-y-1.5 border-l border-border/50 ml-3 pl-3">
                        {group.items.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${isActive
                                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
