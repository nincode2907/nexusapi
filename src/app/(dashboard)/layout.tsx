import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  Zap,
  LayoutDashboard,
  Box,
  Key,
  CreditCard,
  BookOpen,
  LifeBuoy,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./SidebarNav";
import { BalanceDisplay } from "./BalanceDisplay";
import UserNav from "./UserNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-background/50 backdrop-blur-xl shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/60">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            NexusAPI
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-border/60 bg-muted/10">
          <div className="flex items-center justify-between px-2 py-2 mb-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground text-emerald-600 dark:text-emerald-400">100% Operational</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
            <LifeBuoy className="w-4 h-4 mr-3 text-muted-foreground" />
            Hỗ trợ
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border/60 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 gap-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2 font-bold text-lg mr-1">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <BalanceDisplay initialCredit={user?.totalCredit || 0} />
            <Button size="sm" className="bg-primary text-primary-foreground shadow-sm font-medium h-8 rounded-md px-4 cursor-pointer hover:bg-primary/90 hover:shadow-md hover:scale-101 active:scale-99 transition-all duration-200">
              <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
              Nạp Credits
            </Button>
          </div>
          <div className="flex items-center">
            <UserNav email={user?.email} name={user?.name} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
