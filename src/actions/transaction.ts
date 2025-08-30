"use server";

import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { db } from "@/lib/prisma";
import {
  Prisma,
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { getUserSession } from "./auth";

/* ----------------------------- AI SETUP ----------------------------- */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const PRIMARY_MODEL =
  process.env.GEMINI_MODEL_PRIMARY ?? "gemini-2.0-flash-lite";
const FALLBACK_MODEL = process.env.GEMINI_MODEL_FALLBACK ?? "gemini-2.0-flash";

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured.");
}
const AI = new GoogleGenerativeAI(GEMINI_API_KEY);

/* ----------------------------- TYPES -------------------------------- */

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
  financialAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction;
}

type DecimalLike = Prisma.Decimal | number | string;

/* ----------------------------- ZOD SCHEMAS -------------------------- */

const createTransactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  financialAccountId: z.string().min(1),
  amount: z.number().finite(),
  description: z.string().nullable().optional(),
  date: z.union([z.date(), z.string().transform((s) => new Date(s))]),
  category: z.string().min(1),
  receiptUrl: z.string().url().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.nativeEnum(RecurringInterval).nullable().optional(),
  status: z.nativeEnum(TransactionStatus).default("PENDING"),
});

const updateTransactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  financialAccountId: z.string().min(1),
  amount: z.number().finite(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.nativeEnum(RecurringInterval).nullable().optional(),
  date: z.union([z.date(), z.string().transform((s) => new Date(s))]),
  description: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  receiptUrl: z.string().url().nullable().optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export type GetUserTransactionsParams = {
  financialAccountId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  category?: string;
  from?: Date | string;
  to?: Date | string;
  page?: number;
  pageSize?: number; // default 20
};

/* ----------------------------- UTILS -------------------------------- */

const toDecimal = (v: DecimalLike) =>
  v instanceof Prisma.Decimal ? v : new Prisma.Decimal(v);

/** Recursively convert Prisma.Decimal to number for JSON safety. */
function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Prisma.Decimal) return obj.toNumber() as unknown as T;
  if (Array.isArray(obj)) return obj.map(serializeDecimals) as unknown as T;
  if (typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj as any))
      out[k] = serializeDecimals(v);
    return out;
  }
  return obj;
}

function signAmount(type: TransactionType, amount: number): Prisma.Decimal {
  const dec = toDecimal(amount);
  return type === "EXPENSE" ? dec.mul(-1) : dec;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

async function ensureUser() {
  const user = await getUserSession();
  assert(user?.id, "User not authenticated");
  return user.id!;
}

async function ensureAccountOwnedByUser(
  accountId: string,
  userId: string,
  tx: any = db,
) {
  const fa = await tx.financialAccount.findFirst({
    where: { id: accountId, userId },
    select: { id: true },
  });
  assert(fa, "FinancialAccount not found");
}

/** Calculate the next recurring date from startDate given interval. */
function calculateNextRecurringDate(
  startDate: Date,
  interval: RecurringInterval,
): Date {
  const d = new Date(startDate);
  switch (interval) {
    case "DAILY":
      d.setDate(d.getDate() + 1);
      break;
    case "WEEKLY":
      d.setDate(d.getDate() + 7);
      break;
    case "MONTHLY":
      d.setMonth(d.getMonth() + 1);
      break;
    case "YEARLY":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d;
}

/* ----------------------------- ACTIONS ------------------------------ */

/** Create Transaction (race-safe balance update; computes nextRecurringDate). */
export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionResponse> {
  const parsed = createTransactionSchema.parse(input);
  const userId = await ensureUser();

  // Verify the account belongs to user
  await ensureAccountOwnedByUser(parsed.financialAccountId, userId);

  const balanceChange = signAmount(parsed.type, parsed.amount);

  const created = await db.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        type: parsed.type,
        financialAccountId: parsed.financialAccountId,
        amount: toDecimal(parsed.amount),
        description: parsed.description ?? null,
        date: new Date(parsed.date),
        category: parsed.category,
        receiptUrl: parsed.receiptUrl ?? null,
        isRecurring: parsed.isRecurring,
        recurringInterval: parsed.recurringInterval ?? null,
        nextRecurringDate:
          parsed.isRecurring && parsed.recurringInterval
            ? calculateNextRecurringDate(
                new Date(parsed.date),
                parsed.recurringInterval,
              )
            : null,
        status: parsed.status,
      },
    });

    // Increment account balance without reading it first (prevents race)
    await tx.financialAccount.update({
      where: { id: parsed.financialAccountId },
      data: { balance: { increment: balanceChange } },
    });

    return newTransaction;
  });

  revalidatePath("/dashboard");
  revalidatePath(`/financialAccount/${created.financialAccountId}`);

  return {
    success: true,
    data: serializeDecimals(created) as unknown as Transaction,
  };
}

/** Get single transaction, scoped to user. */
export async function getTransaction(id: string): Promise<Transaction | null> {
  const userId = await ensureUser();

  // Use findFirst to enforce user scope even if no composite unique
  const tx = await db.transaction.findFirst({
    where: { id, userId },
  });
  assert(tx, "Transaction not found");

  return serializeDecimals(tx) as unknown as Transaction;
}

/**
 * Update transaction.
 * If financialAccountId changes:
 *   - reverse the old transaction on the OLD account
 *   - apply the new transaction on the NEW account
 * Else:
 *   - increment by (newChange - oldChange) on the SAME account
 */
export async function updateTransaction(
  id: string,
  payload: UpdateTransactionInput,
): Promise<TransactionResponse> {
  const data = updateTransactionSchema.parse(payload);
  const userId = await ensureUser();

  const updatedTx = await db.$transaction(async (tx) => {
    const original = await tx.transaction.findFirst({
      where: { id, userId },
      include: { financialAccount: { select: { id: true } } },
    });
    assert(original, "Transaction not found");

    // Validate ownership of target account too
    await ensureAccountOwnedByUser(data.financialAccountId, userId, tx);

    const oldChange = signAmount(original.type, original.amount.toNumber());
    const newChange = signAmount(data.type, data.amount);

    // Update transaction row first
    const updated = await tx.transaction.update({
      where: { id },
      data: {
        type: data.type,
        financialAccountId: data.financialAccountId,
        amount: toDecimal(data.amount),
        isRecurring: data.isRecurring,
        recurringInterval: data.recurringInterval ?? null,
        date: new Date(data.date),
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(
                new Date(data.date),
                data.recurringInterval,
              )
            : null,
        description: data.description ?? original.description,
        category: data.category ?? original.category,
        receiptUrl: data.receiptUrl ?? original.receiptUrl,
        status: data.status ?? original.status,
      },
    });

    const accountChanged =
      original.financialAccountId !== data.financialAccountId;

    if (accountChanged) {
      // Reverse old impact on old account
      await tx.financialAccount.update({
        where: { id: original.financialAccountId },
        data: { balance: { increment: oldChange.mul(-1) } },
      });
      // Apply new impact on new account
      await tx.financialAccount.update({
        where: { id: data.financialAccountId },
        data: { balance: { increment: newChange } },
      });
    } else {
      // Same account: apply delta
      const delta = newChange.sub(oldChange);
      if (!delta.eq(0)) {
        await tx.financialAccount.update({
          where: { id: data.financialAccountId },
          data: { balance: { increment: delta } },
        });
      }
    }

    return updated;
  });

  // Revalidate both accounts if changed
  revalidatePath("/dashboard");
  revalidatePath(`/financialAccount/${updatedTx.financialAccountId}`);

  return {
    success: true,
    data: serializeDecimals(updatedTx) as unknown as Transaction,
  };
}

/** List user transactions with filters + pagination; returns JSON-safe data. */
export async function getUserTransactions(
  params: GetUserTransactionsParams = {},
) {
  const userId = await ensureUser();

  const {
    financialAccountId,
    type,
    status,
    category,
    from,
    to,
    page = 1,
    pageSize = 20,
  } = params;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(financialAccountId ? { financialAccountId } : {}),
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(from || to
      ? {
          date: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const [total, items] = await db.$transaction([
    db.transaction.count({ where }),
    db.transaction.findMany({
      where,
      include: {
        financialAccount: { select: { id: true, name: true, balance: true } },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    success: true,
    data: serializeDecimals(items),
    meta: { total, page, pageSize, totalPages },
  };
}

/* ----------------------------- RECEIPT SCAN ------------------------- */

const ScannedReceiptSchema = z.object({
  amount: z.number().finite().nonnegative(),
  date: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v : new Date(v))),
  description: z.string().default(""),
  merchantName: z.string().default(""),
  category: z
    .enum([
      "housing",
      "transportation",
      "groceries",
      "utilities",
      "entertainment",
      "food",
      "shopping",
      "healthcare",
      "education",
      "personal",
      "travel",
      "insurance",
      "gifts",
      "bills",
      "other-expense",
    ])
    .default("other-expense"),
});

export type ScannedReceipt = z.infer<typeof ScannedReceiptSchema>;

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
]);
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

async function runGeminiScan(
  modelId: string,
  base64: string,
  mime: string,
  prompt: string,
  ai: any,
) {
  const model = ai.getGenerativeModel({
    model: modelId,
    generationConfig: { temperature: 0, maxOutputTokens: 512 },
  });
  const res = await model.generateContent([
    { inlineData: { data: base64, mimeType: mime } },
    prompt,
  ]);
  const raw = (await res.response.text())
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "");
  return JSON.parse(raw || "{}");
}

export async function scanReceipt(formData: FormData): Promise<ScannedReceipt> {
  const file = formData.get("file") as File | null;
  assert(file, "No file provided");

  assert(ALLOWED_MIME.has(file.type), "Unsupported file type");
  assert(file.size <= MAX_FILE_BYTES, "File too large");

  // Convert to base64 (no logging sensitive data)
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  const prompt = `
Analyze this receipt image and extract the following information in JSON format:

- Total amount (just the number)
- Date (in ISO format)
- Description or items purchased (brief summary)
- Merchant/store name
- Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )

Only respond with valid JSON in this exact format:
{
"amount": number,
"date": "ISO date string",
"description": "string",
"merchantName": "string",
"category": "string"
}

If its not a recipt, return an empty object
  `.trim();

  try {
    let parsed = await runGeminiScan(
      PRIMARY_MODEL,
      base64,
      file.type,
      prompt,
      AI,
    );
    const isEmpty =
      parsed && typeof parsed === "object" && Object.keys(parsed).length === 0;

    if (isEmpty || parsed.amount == null || !parsed.date) {
      // fallback for tougher receipts
      parsed = await runGeminiScan(
        FALLBACK_MODEL,
        base64,
        file.type,
        prompt,
        AI,
      );
    }

    // validate + normalize as you already do with Zod
    return ScannedReceiptSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to scan receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}

/* ----------------------------- NOTES --------------------------------
- Ensure your Prisma schema uses Decimal for monetary fields:
    amount   Decimal @db.Decimal(18, 6)
    balance  Decimal @db.Decimal(18, 6)
  and consider indexing by (userId, date) for lists.

- We always update balances with { increment: Decimal } inside a single
  transaction to avoid race conditions.

- updateTransaction correctly handles switching financial accounts.

- All returned data is JSON-safe via serializeDecimals (no Decimal in payloads).

- getUserTransactions adds useful filters + pagination and returns meta.

- scanReceipt validates input file, enforces size/type, and strictly parses AI output.
--------------------------------------------------------------------- */
