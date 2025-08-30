"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getUserSession() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    return session.user;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
}
