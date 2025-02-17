import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the access token from cookies or headers
  const accessToken = request.cookies.get("accessToken")?.value;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/tasks"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !accessToken) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(homeUrl);
  }

  // If we have a token, add it to the Authorization header
  if (accessToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
