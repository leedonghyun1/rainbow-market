import { NextRequest, NextFetchEvent, userAgent, NextResponse } from "next/server"

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith(`/`)) {
    if (!req.url.includes("/api")) {
      if (!req.url.includes("/enter") && !req.cookies.has("ccosmossession")) {
        // body 가 넘어가지 않기 때문에 error page 작성 필요.
        req.nextUrl.searchParams.set("from", req.nextUrl.pathname);
        req.nextUrl.pathname = "/enter";
        return NextResponse.redirect(req.nextUrl);
      }
    }
    // console.log(`GEO: ${req.geo}`);
  }
} 