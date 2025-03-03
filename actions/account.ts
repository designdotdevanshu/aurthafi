"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { getUserSession } from "./auth";
import { AccountType } from "@prisma/client";
import { errorHandler, serializeDecimal } from "@/lib/utils";
import { Transaction } from "./transaction";

export interface Account {
  name: string;
  id: string;
  type: AccountType;
  balance: number;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountResponse {
  success: boolean;
  data?: Account;
}

interface AccountWithTransactions extends Account {
  transactions: Transaction[];
  _count: {
    transactions: number;
  };
}

export async function getAccountWithTransactions(
  id: string,
): Promise<AccountWithTransactions | null> {
  if (!id) return null;

  try {
    const { id: userId } = await getUserSession();

    const account = await db.account.findUnique({
      where: { id, userId },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!account) return null;

    return {
      ...serializeDecimal(account),
      transactions: account.transactions.map(serializeDecimal),
    };
  } catch (error) {
    throw errorHandler(error);
  }
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { id: userId } = await getUserSession();
    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId,
      },
    });

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce(
      (acc, transaction) => {
        const change =
          transaction.type === "EXPENSE"
            ? transaction.amount.toNumber()
            : -transaction.amount.toNumber();
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId,
        },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges,
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    throw errorHandler(error);
  }
}

export async function updateDefaultAccount(
  id: string,
): Promise<AccountResponse | null> {
  try {
    const { id: userId } = await getUserSession();

    // First, unset any existing default account
    await db.account.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then set the new default account
    const account = await db.account.update({
      where: { id, userId },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializeDecimal(account) as unknown as AccountResponse["data"],
    };
  } catch (error) {
    throw errorHandler(error);
  }
}
