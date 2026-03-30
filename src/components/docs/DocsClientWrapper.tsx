"use client";

import React, { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen, List } from "lucide-react";
import { usePathname } from "next/navigation";

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function DocsClientWrapper({
    children,
    sidebar
}: {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [headings, setHeadings] = useState<Heading[]>([]);
    const pathname = usePathname();

    // 🚀 MA THUẬT QUÉT MỤC LỤC TỰ ĐỘNG
    useEffect(() => {
        // Dùng setTimeout để đợi DOM render xong nội dung trang mới
        const timer = setTimeout(() => {
            // Tìm khu vực chứa nội dung bài viết
            const contentDiv = document.getElementById("docs-content");
            if (!contentDiv) return;

            // Quét tất cả thẻ H2, H3
            const elements = Array.from(contentDiv.querySelectorAll("h2, h3"));

            const newHeadings = elements.map((el) => {
                // 🚀 Tự động tạo ID từ nội dung (Hỗ trợ tiếng Việt và ký tự đặc biệt)
                if (!el.id) {
                    const slug = el.textContent
                        ?.trim()
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
                        .replace(/[đĐ]/g, "d")
                        .replace(/[^a-z0-9]+/g, "-") // Biến khoảng trắng thành gạch ngang
                        .replace(/(^-|-$)/g, "");    // Xóa dấu gạch ngang ở đầu/cuối
                    el.id = slug || "heading-" + Math.random().toString(36).substr(2, 5);
                }
                return {
                    id: el.id,
                    text: el.textContent || "",
                    level: el.tagName === "H2" ? 2 : 3,
                };
            });

            setHeadings(newHeadings);
        }, 150); // Delay 150ms để Next.js thay đổi DOM layout xong

        return () => clearTimeout(timer);
    }, [pathname, children]); // Chạy lại mỗi khi chuyển trang (pathname thay đổi)

    // Hàm cuộn mượt mà tới mục lục
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Sử dụng scrollIntoView là cách hiện đại và hỗ trợ tốt cho layout lồng nhau
            // Để tránh bị dính sát mép trên do sticky header, ta sẽ thêm scroll-margin-top vào CSS của các thẻ h2, h3
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex max-w-[1400px] mx-auto overflow-visible">

            {/* CỘT TRÁI: Navigation Sidebar (Có thể Toggle đóng mở) */}
            <aside
                className={`shrink-0 h-[calc(100vh-120px)] sticky top-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                    }`}
            >
                <div className={`h-full overflow-y-auto pr-6 custom-scrollbar ${isSidebarOpen ? "block" : "hidden"}`}>
                    {sidebar}
                </div>
            </aside>

            {/* CỘT GIỮA: Nội dung chính */}
            <main className="flex-1 min-w-0 py-4 px-4 md:px-8 lg:px-12 transition-all duration-300">
                <div className="max-w-5xl mx-auto relative">

                    {/* NÚT TOGGLE ẨN/HIỆN SIDEBAR NẰM LƠ LỬNG GÓC TRÁI (Sticky khi cuộn) */}
                    <div className="sticky top-6 z-40 h-0 overflow-visible w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex absolute -left-12 top-0 items-center justify-center w-8 h-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/50 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            title={isSidebarOpen ? "Ẩn menu (Mở rộng khu vực đọc)" : "Hiện menu"}
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Vùng chứa nội dung (Gắn ID để useEffect quét thẻ H2, H3 ở trong này) */}
                    <div id="docs-content" className="[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24">
                        {children}
                    </div>
                </div>
            </main>

            {/* CỘT PHẢI: Mục lục On-this-page (MỤC LỤC ĐỘNG) */}
            <aside className="hidden xl:block w-[240px] shrink-0 h-[calc(100vh-120px)] sticky top-20">
                <div className="h-full overflow-y-auto pl-6 border-l border-border/50 custom-scrollbar">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <List className="w-4 h-4" /> Trên trang này
                        </h4>

                        {headings.length > 0 ? (
                            <ul className="space-y-2.5 text-sm">
                                {headings.map((heading) => (
                                    <li
                                        key={heading.id}
                                        className={`cursor-pointer transition-colors hover:text-foreground ${heading.level === 3 ? "pl-4 text-muted-foreground/80" : "text-muted-foreground font-medium"
                                            }`}
                                        onClick={() => scrollToHeading(heading.id)}
                                    >
                                        <span className="line-clamp-2">{heading.text}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">Không có mục lục</p>
                        )}
                    </div>
                </div>
            </aside>

        </div>
    );
}