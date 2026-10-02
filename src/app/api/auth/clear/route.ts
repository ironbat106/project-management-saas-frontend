import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, ORG_COOKIE, REFRESH_COOKIE } from "@/lib/constants";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/login?reason=session", request.url),
  );

  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  response.cookies.delete(ORG_COOKIE);

  return response;
}
