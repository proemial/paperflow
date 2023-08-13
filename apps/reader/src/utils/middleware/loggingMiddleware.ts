import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";

export const loggingMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const path = request.nextUrl.pathname;
    if(!path.startsWith('/_next') && path !== '/api/socket.io')
        console.log(path);
    return next(request, _next);
  };
};
