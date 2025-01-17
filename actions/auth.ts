"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { Provider } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/lib/utils";

type SignupPayload = {
  displayName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ApiResponse<T> = {
  message: string;
  data: T | null;
};

// Utility to create Supabase client
function initializeSupabase() {
  return createClient();
}

// Fetch user session
export async function getUserSession() {
  try {
    const supabase = await initializeSupabase(); // Ensure the promise is resolved
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return handleError(error);
    if (!user) return handleError("User not found");
    return user;
  } catch (error) {
    return handleError(error);
  }
}

// Signup logic
export async function signup({
  displayName,
  email,
  password,
}: SignupPayload): Promise<ApiResponse<any>> {
  const origin = headers().get("origin");
  const supabase = await initializeSupabase();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName },
      emailRedirectTo: `${origin}/auth/signin`,
    },
  });

  if (error) return handleError(error);
  if (!data.user?.identities?.length) {
    // throw new Error("User with this email already exists");
    return handleError("User with this email already exists");
  }

  // Revalidate paths and redirect
  revalidatePath("/", "layout");
  redirect("/auth/signin");

  return { message: "Signup successful", data: data.user };
}

// Login logic
export async function signin({
  email,
  password,
}: LoginPayload): Promise<ApiResponse<any>> {
  const supabase = await initializeSupabase();
  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return handleError(error);

  // Check or create user in Prisma
  const existingUser = await db.user.findUnique({
    where: { email: user?.email },
  });
  if (!existingUser) {
    await db.user.create({
      data: {
        id: user?.id,
        email: user?.email as string,
        displayName: user?.user_metadata?.displayName,
        avatarUrl: user?.user_metadata?.avatar_url,
      },
    });
  } else if (existingUser.avatarUrl !== user?.user_metadata?.avatar_url) {
    await db.user.update({
      where: { email: user?.email },
      data: {
        avatarUrl: user?.user_metadata?.avatar_url,
      },
    });
  }

  // Revalidate paths
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

// Logout logic
export async function signout(): Promise<ApiResponse<null>> {
  const supabase = await initializeSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) return handleError(error);

  // Revalidate paths and redirect
  revalidatePath("/", "layout");
  redirect("/auth/signin");
  return { message: "Logout successful", data: null };
}

// Update user profile
export async function updateProfile({
  displayName,
  avatarUrl,
}: {
  displayName?: string;
  avatarUrl?: string;
}): Promise<ApiResponse<any>> {
  try {
    const supabase = await initializeSupabase();
    const { error, data } = await supabase.auth.updateUser({
      data: {
        displayName,
        avatar_url: avatarUrl,
      },
    });

    if (error) return handleError(error);
    return { message: "Profile updated successfully", data };
  } catch (error) {
    return handleError(error);
  }
}

// Sign in with provider
export async function signInWithProvider(
  provider: Provider,
): Promise<ApiResponse<any>> {
  const origin = headers().get("origin");
  const supabase = await initializeSupabase();
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { next: `${origin}/dashboard` },
    },
  });

  if (error) {
    return handleError(error);
  } else if (data.url) {
    redirect(data.url);
  }
  return { message: "Redirecting to provider", data: null };
}
