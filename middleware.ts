import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname, search } = request.nextUrl;

  const authRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const protectedRoutes = [
    "/dashboard",
    "/transaction",
    "/account",
    "/profile",
  ];

  // If authenticated, block access to auth pages
  if (sessionCookie && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If unauthenticated, block access to protected pages
  if (
    !sessionCookie &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transaction/:path*",
    "/account/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
