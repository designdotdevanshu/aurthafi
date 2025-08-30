import { type NextRequest } from "next/server";
import { seedTransactions } from "@/actions/seed";

// http://localhost:3000/api/seed?userId=b8106a28-a86f-490c-9a89-0dab22dcec47&accountId=1b3a47a2-4e6b-4f2e-8714-4f2f23aade8e&limit=5

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const accountId = searchParams.get("accountId");
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : undefined;

  if (!userId || !accountId) {
    return Response.json({
      error: "userId and accountId are required",
    });
  }

  const result = await seedTransactions(userId, accountId, limit);
  return Response.json({
    message: "Seed transactions",
    result,
  });
}
