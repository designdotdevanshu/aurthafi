export const dynamic = "force-dynamic"; // static by default, unless reading the request

import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { Transaction } from "@prisma/client";

export const runtime = "nodejs"; // Ensure Node.js runtime

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Find recurring transactions due for processing
    const recurringTransactions = await db.transaction.findMany({
      where: {
        isRecurring: true,
        status: "COMPLETED",
        OR: [
          { lastProcessed: null },
          {
            nextRecurringDate: {
              lte: new Date(),
            },
          },
        ],
      },
    });

    // Process each recurring transaction
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
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

async function processRecurringTransaction(transaction: Transaction) {
  // Perform transaction processing in a database transaction
  await db.$transaction(async (tx) => {
    // Create new transaction record
    await tx.transaction.create({
      data: {
        type: transaction.type,
        amount: transaction.amount,
        description: `${transaction.description} (Recurring)`,
        date: new Date(),
        category: transaction.category,
        userId: transaction.userId,
        accountId: transaction.accountId,
        isRecurring: false,
      },
    });

    // Update account balance
    const balanceChange =
      transaction.type === "EXPENSE"
        ? -transaction.amount.toNumber()
        : transaction.amount.toNumber();

    await tx.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: balanceChange } },
    });

    // Update transaction metadata
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        lastProcessed: new Date(),
        nextRecurringDate: transaction.recurringInterval
          ? calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval,
            )
          : null,
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
