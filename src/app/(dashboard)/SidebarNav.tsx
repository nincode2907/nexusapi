"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Key,
  CreditCard,
  BookOpen
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/models", label: "Siêu thị Models", icon: Box },
    { href: "/api-keys", label: "API Keys", icon: Key },
    { href: "/billing", label: "Thanh toán", icon: CreditCard },
    { href: "/docs", label: "Tài liệu", icon: BookOpen },
  ];

  return (
    <>
      <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Menu</div>
      {links.map((link) => {
        // Special case: /dashboard shouldn't match /dashboard/keys just because it starts with it,
        // but since keys is now /api-keys, simple exact match or startsWith works.
        const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
        const Icon = link.icon;

        return (
          <Link key={link.href} href={link.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1 transition-all cursor-pointer",
                isActive
                  ? "bg-accent text-accent-foreground font-medium shadow-sm border border-border/50"
                  : "font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-4 h-4 mr-3", isActive ? "text-foreground" : "text-muted-foreground")} />
              {link.label}
            </Button>
          </Link>
        )
      })}
    </>
  );
}
