"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import {
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { getUserSession } from "./auth";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: Date;
  category: string;
  receiptUrl: string | null;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
  nextRecurringDate: Date | null;
  lastProcessed: Date | null;
  status: TransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction;
}

const serializeAmount = (obj: any) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// Create Transaction
export async function createTransaction(
  data: Transaction,
): Promise<TransactionResponse> {
  try {
    const { id: userId } = await getUserSession();

    const account = await db.account.findUnique({
      where: { id: data.accountId, userId },
    });

    if (!account) throw new Error("Account not found");

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = Number(account.balance) + Number(balanceChange);

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  try {
    const { id: userId } = await getUserSession();

    const transaction = await db.transaction.findUnique({
      where: { id, userId },
    });

    if (!transaction) throw new Error("Transaction not found");

    return transaction as unknown as Transaction;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateTransaction(
  id: string,
  data: {
    type: TransactionType; // Use Prisma's enum for type safety
    accountId: string;
    amount: number;
    isRecurring: boolean;
    recurringInterval: RecurringInterval;
    date: Date;
  },
) {
  try {
    const { id: userId } = await getUserSession();

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: { id, userId },
      include: { account: true },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id, userId },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
  try {
    const { id: userId } = await getUserSession();

    const transactions = await db.transaction.findMany({
      where: { ...query, userId },
      include: { account: true },
      orderBy: { date: "desc" },
    });

    return { success: true, data: transactions };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(
  startDate: string | number | Date,
  interval: RecurringInterval,
) {
  const date = new Date(startDate);

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
  }

  return date;
}
