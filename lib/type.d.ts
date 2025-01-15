import { z } from "zod";
import { accountSchema, transactionSchema } from "./schema";

export type Account = z.infer<typeof accountSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
