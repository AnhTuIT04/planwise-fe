import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ROUTES, PUBLIC_ROUTES, REDIRECT_AFTER_AUTH, REDIRECT_IF_NOT_AUTH } from "@/lib/router";
import { authApi } from "@/apis/auth/auth.api";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const pathname = nextUrl.pathname;
  const isLoggedIn = await authApi()
    .then(() => true)
    .catch(() => false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Allow access to public routes and API auth routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to REDIRECT_AFTER_AUTH if logged in and trying to access an auth route (auth routes is used for authentication)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(REDIRECT_AFTER_AUTH, nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect to REDIRECT_IF_NOT_AUTH if not logged in and trying to access a protected route
  if (!isLoggedIn) {
    return Response.redirect(new URL(REDIRECT_IF_NOT_AUTH, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
