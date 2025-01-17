"use server";

import { revalidatePath } from "next/cache";
import { getUserSession } from "./auth";
import { db } from "@/lib/prisma";
import { errorHandler, serializeDecimal } from "@/lib/utils";
import { asyncHandler } from "@/lib/utils";
import { Transaction } from "./transaction";
import { Account } from "./account";

export async function getUserAccounts(): Promise<Account[]> {
  try {
    const { id: userId } = await getUserSession();

    const accounts = await db.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
    const serializedAccounts = await Promise.all(
      accounts.map(serializeDecimal),
    );

    return serializedAccounts;
  } catch (error) {
    throw errorHandler(error);
  }
}

export async function createAccount(data: Account) {
  return asyncHandler(async function (): Promise<Account> {
    const { id: userId } = await getUserSession();

    // Convert balance to float before saving
    const balanceFloat = Number(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId },
    });

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new account
    const account = await db.account.create({
      data: {
        ...data,
        userId,
        balance: balanceFloat,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    // Serialize the account before returning
    const serializedAccount = serializeDecimal(account);

    revalidatePath("/dashboard");
    return serializedAccount;
  });
}

export async function getDashboardData(): Promise<Transaction[]> {
  try {
    const { id: userId } = await getUserSession();

    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return await Promise.all(transactions.map(serializeDecimal));
  } catch (error) {
    throw errorHandler(error);
  }
}
