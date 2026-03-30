import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage(props: { searchParams: Promise<{ page?: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10; // Mỗi trang 10 giao dịch

  const [totalTransactions, transactions] = await Promise.all([
    prisma.transaction.count({ where: { userId: session.user.id } }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalTransactions / pageSize) || 1;

  return (
    <div className="space-y-6">
      <HistoryClient
        initialTransactions={JSON.parse(JSON.stringify(transactions))}
        currentPage={currentPage}
        totalPages={totalPages}
        totalTransactions={totalTransactions}
      />
    </div>
  );
}
