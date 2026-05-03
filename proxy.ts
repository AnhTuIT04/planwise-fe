import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAuthServerApi } from "@/services/apis/auth/auth-server.api";

const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/sign-up/verify",
  "/oauth/success",
  "/forgot-password",
  "/forgot-password/verify",
  "/forgot-password/reset",
];

const PUBLIC_ROUTES = ["/"];

export default async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const pathname = nextUrl.pathname;
  console.log("pathname: ", pathname);
  console.log("request: ", request.cookies);
  const isLoggedIn = await getAuthServerApi()
    .then(() => true)
    .catch(() => false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Allow access to public routes and API auth routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to "/my-tasks" if logged in and trying to access an auth route (auth routes is used for authentication)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/my-tasks", nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect to "/sign-in" if not logged in and trying to access a protected route
  if (!isLoggedIn) {
    return Response.redirect(new URL("/sign-in", nextUrl));
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
