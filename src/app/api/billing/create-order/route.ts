import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subMinutes } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });
    }

    const topupPackage = await prisma.topupPackage.findUnique({
      where: { id: packageId },
    });

    if (!topupPackage || !topupPackage.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive package" },
        { status: 400 }
      );
    }

    const totalCreditAdded = Number((topupPackage.creditAmnt + topupPackage.bonusCredit).toFixed(2));

    const fifteenMinsAgo = subMinutes(new Date(), 15);

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        userId: session.user.id,
        amountVnd: topupPackage.priceVnd,
        type: "TOPUP",
        status: "PENDING",
        createdAt: { gte: fifteenMinsAgo },
      },
    });

    if (existingTransaction) {
      return NextResponse.json({
        success: true,
        transactionId: existingTransaction.id,
        amountVnd: existingTransaction.amountVnd,
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amountVnd: topupPackage.priceVnd,
        creditAdded: totalCreditAdded,
        type: "TOPUP",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      amountVnd: transaction.amountVnd,
    });
  } catch (error) {
    console.error("[BILLING_CREATE_ORDER]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
