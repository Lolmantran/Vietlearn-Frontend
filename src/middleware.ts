import { NextRequest, NextResponse } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/onboarding"];
const PUBLIC_PREFIXES = ["/api/", "/_next/", "/favicon", "/google.svg"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static files
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // Check for token in cookie (set by setToken() on login)
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
