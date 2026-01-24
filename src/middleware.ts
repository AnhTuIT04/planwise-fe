import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ROUTES, PUBLIC_ROUTES, REDIRECT_AFTER_AUTH, REDIRECT_IF_NOT_AUTH } from "@/lib/router";
import { authApi } from "@/apis/auth/auth.api";
import { refreshTokenApi } from "@/apis/auth/refresh-token.api";

async function isAuthenticated(): Promise<boolean> {
  try {
    await authApi();
    return true;
  } catch (err: any) {
    if (err?.status !== 401) {
      return false;
    }

    try {
      console.log("Attempting to refresh token...");
      await refreshTokenApi();
      console.log("Token refreshed successfully.");
      return true;
    } catch {
      return false;
    }
  }
}

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const pathname = nextUrl.pathname;
  const isLoggedIn = await authApi()
    .then(() => true)
    .catch(() => false);
  // const isLoggedIn = await isAuthenticated();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

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

  if (!isLoggedIn) {
    return Response.redirect(new URL(REDIRECT_IF_NOT_AUTH, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};