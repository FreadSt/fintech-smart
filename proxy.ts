import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES } from "@/lib/auth/constants";

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSupabaseAuthCookie(request);
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff2)$).*)",
  ],
};
