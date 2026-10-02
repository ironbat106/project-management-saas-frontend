import { type NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { ACCESS_COOKIE, REFRESH_COOKIE, ROLE_HOME } from "@/lib/constants";
import {
  cookieOptions,
  isExpired,
  readClaims,
  refreshLifetime,
} from "@/lib/session-shared";
import type { AuthTokens, Role } from "@/types";

const ROLE_AREAS: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/owner", role: "OWNER" },
  { prefix: "/member", role: "MEMBER" },
];

const SHARED_PROTECTED = ["/profile", "/payment"];

const AUTH_PAGES = ["/login", "/register"];

async function refreshTokens(refreshToken: string) {
  try {
    const response = await backendFetch<AuthTokens>("/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
    });
    return response.data;
  } catch {
    return null;
  }
}

function matches(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/proxy");

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  let claims = readClaims(accessToken);
  let renewed: AuthTokens | null = null;

  if (
    isExpired(claims) &&
    refreshToken &&
    !isExpired(readClaims(refreshToken), 0)
  ) {
    renewed = await refreshTokens(refreshToken);
    if (renewed) {
      accessToken = renewed.accessToken;
      claims = readClaims(accessToken);
      request.cookies.set(ACCESS_COOKIE, renewed.accessToken);
      request.cookies.set(REFRESH_COOKIE, renewed.refreshToken);
    }
  }

  const isLoggedIn = !!claims && !isExpired(claims, 0);

  let response: NextResponse | null = null;

  if (!isApi) {
    const area = ROLE_AREAS.find((item) => matches(pathname, item.prefix));
    const isShared = SHARED_PROTECTED.some((item) => matches(pathname, item));
    const isAuthPage = AUTH_PAGES.includes(pathname);

    if ((area || isShared) && !isLoggedIn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      response = NextResponse.redirect(url);
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
    } else if (area && claims && area.role !== claims.role) {
      response = NextResponse.redirect(
        new URL(ROLE_HOME[claims.role], request.url),
      );
    } else if (isAuthPage && isLoggedIn && claims) {

      if (!request.nextUrl.searchParams.has("reason")) {
        response = NextResponse.redirect(
          new URL(ROLE_HOME[claims.role], request.url),
        );
      }
    }
  }

  response ??= NextResponse.next({ request });

  if (renewed) {
    const maxAge = refreshLifetime(renewed.refreshToken);
    response.cookies.set(
      ACCESS_COOKIE,
      renewed.accessToken,
      cookieOptions(maxAge),
    );
    response.cookies.set(
      REFRESH_COOKIE,
      renewed.refreshToken,
      cookieOptions(maxAge),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/member/:path*",
    "/profile",
    "/payment/:path*",
    "/login",
    "/register",
    "/api/proxy/:path*",
  ],
};
