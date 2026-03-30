"use client";

import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import Link from "next/link";

export default function UserNav({ email, name }: { email?: string, name?: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-center h-10 w-10 rounded-full bg-muted/50 hover:bg-muted/80 border border-border cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                <User className="h-5 w-5 text-muted-foreground" />
            </DropdownMenuTrigger>

            {/* MENU SỔ XUỐNG */}
            <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* Phần Header Menu: Hiển thị tên/email */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{name || "Khách hàng"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {email || "user@nexus.com"}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Các lựa chọn Menu */}
                <DropdownMenuGroup>
                    <Link href="/settings">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Cài đặt tài khoản</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/billing">
                        <DropdownMenuItem className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Thanh toán & Hóa đơn</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* NÚT LOGOUT QUYỀN LỰC */}
                <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}