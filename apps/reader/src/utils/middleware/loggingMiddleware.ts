import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";

export const loggingMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if(!request.nextUrl.pathname.startsWith('/_next'))
        console.log(request.nextUrl.pathname);
    return next(request, _next);
  };
};
