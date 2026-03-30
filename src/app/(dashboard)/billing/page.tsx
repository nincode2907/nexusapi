import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const [user, packages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalCredit: true },
    }),
    prisma.topupPackage.findMany({
      where: { isActive: true },
      orderBy: { priceVnd: "asc" },
    }),
  ]);

  const bankConfig = {
    bankCode: process.env.RECEIVING_BANK_CODE || "MB",
    accountNo: process.env.RECEIVING_BANK_ACCOUNT || "",
    accountName: process.env.RECEIVING_ACCOUNT_NAME || "",
  }

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillingClient initialCredit={user.totalCredit} packages={packages} bankConfig={bankConfig} />
    </div>
  );
}
