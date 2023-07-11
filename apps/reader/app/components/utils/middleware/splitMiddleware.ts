import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./middleware";

export const splitMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const response = NextResponse.next();

    // this is the cookie name that we will use to store the identifier
    const SPLIT_USER_COOKIE = "splitKey";

    // is there a cookie with the identifier?
    let splitKeyCookieValue = request.cookies.get(SPLIT_USER_COOKIE)?.value;

    // if not, create a new one
    if (splitKeyCookieValue === undefined) {
      splitKeyCookieValue = self.crypto.randomUUID();
      response.cookies.set(SPLIT_USER_COOKIE, splitKeyCookieValue);
    }

    // add the identifier to the response header
    response.headers.set("x-split-user", splitKeyCookieValue);

    return response;
  };
};
