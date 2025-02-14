import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        error: userError,
        data: { user },
      } = await supabase.auth.getUser();
      if (userError) {
        // return the user to an error page with instructions
        return NextResponse.redirect(`${origin}/error`);
      }

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

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
