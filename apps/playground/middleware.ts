import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user] = atob(authValue).split(":");

    const validUsers = ['mgb', 'mgb4'];

    if (validUsers.includes(user)) {
      return NextResponse.next();
    }
  }

  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
