export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { Transaction } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const isAuthorized =
      request.headers.get("authorization") ===
      `Bearer ${process.env.CRON_SECRET}`;

    if (!isDev && !isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const recurringTransactions = await db.transaction.findMany({
      where: {
        isRecurring: true,
        status: "COMPLETED",
        OR: [
          { lastProcessed: null },
          { nextRecurringDate: { lte: new Date() } },
        ],
      },
    });

    for (const transaction of recurringTransactions) {
      await processRecurringTransaction(transaction);
    }

    return NextResponse.json({
      success: true,
      processed: recurringTransactions.length,
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

async function processRecurringTransaction(transaction: Transaction) {
  await db.$transaction(async (tx) => {
    let dueDate: Date =
      transaction.nextRecurringDate ??
      transaction.lastProcessed ??
      transaction.date;

    const now = new Date();
    const newTransactions = [];
    let balanceDelta = 0;
    let lastProcessedDate: Date | null = null;

    // Batch generate missed occurrences
    while (dueDate <= now) {
      newTransactions.push({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description?.includes("(Recurring)")
          ? transaction.description
          : `${transaction.description} (Recurring)`,
        date: dueDate,
        category: transaction.category,
        userId: transaction.userId,
        financialAccountId: transaction.financialAccountId,
        isRecurring: false,
      });

      balanceDelta +=
        transaction.type === "EXPENSE"
          ? -transaction.amount.toNumber()
          : transaction.amount.toNumber();

      lastProcessedDate = dueDate;

      if (!transaction.recurringInterval) break;
      dueDate = calculateNextRecurringDate(
        dueDate,
        transaction.recurringInterval,
      );
    }

    if (!lastProcessedDate) return; // nothing due

    // Insert all new transactions in one go
    if (newTransactions.length > 0) {
      await tx.transaction.createMany({ data: newTransactions });
    }

    // Apply balance once
    if (balanceDelta !== 0) {
      await tx.financialAccount.update({
        where: { id: transaction.financialAccountId },
        data: { balance: { increment: balanceDelta } },
      });
    }

    // Update metadata
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        lastProcessed: lastProcessedDate,
        nextRecurringDate: dueDate, // first future date
      },
    });
  });
}

function calculateNextRecurringDate(currentDate: Date, interval: string) {
  const date = new Date(currentDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid recurring interval");
  }
  return date;
}
