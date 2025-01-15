import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define route arrays
const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PUBLIC_ROUTES = ["/", "/error"];

// Utility to check if a route is public or auth-related
const isPublicRoute = (pathname: string) =>
  AUTH_ROUTES.includes(pathname) ||
  PUBLIC_ROUTES.includes(pathname) ||
  pathname.startsWith("/auth/");

export async function updateSession(request: NextRequest) {
  // Create an initial response object
  const supabaseResponse = NextResponse.next({ request });

  // Initialize Supabase client with cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Fetch the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the current path
  const pathname = request.nextUrl.pathname;
  // Handle redirection for authentication routes
  if (AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/auth${pathname}`;
    return NextResponse.redirect(url);
  }

  // Handle cases where the user is not authenticated
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin"; // Redirect to signin if not authenticated
    return NextResponse.redirect(url);
  }

  // Handle cases where the user is authenticated but visits a public route
  if (user && isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard"; // Redirect to dashboard if authenticated
    return NextResponse.redirect(url);
  }

  // Ensure cookies are synced in the final response
  return supabaseResponse;
}

// IMPORTANT: You *must* return the supabaseResponse object as it is.
// If you're creating a new response object with NextResponse.next() make sure to:
// 1. Pass the request in it, like so:
//    const myNewResponse = NextResponse.next({ request })
// 2. Copy over the cookies, like so:
//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
// 3. Change the myNewResponse object to fit your needs, but avoid changing
//    the cookies!
// 4. Finally:
//    return myNewResponse
// If this is not done, you may be causing the browser and server to go out
// of sync and terminate the user's session prematurely!
