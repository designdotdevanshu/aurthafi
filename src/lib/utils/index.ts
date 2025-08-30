export * from "./cn";

// Utility to handle errors
export function handleError(error: any): any {
  console.error("Error:", error);
  // throw new Error(error.message || "An unexpected error occurred");
  // return error.message || "An unexpected error occurred";
  return {
    message:
      typeof error === "string"
        ? error
        : error.message || "An unexpected error occurred",
    data: null,
  };
}

export async function asyncHandler<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return (await fn()) as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`An error occurred: ${errorMessage}`);
    throw new Error("An error occurred");
  }
}

export async function errorHandler(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`An unknown error occurred: ${errorMessage}`);
  throw new Error("An unknown error occurred");
}

export function serializeDecimal(obj: any) {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
}
