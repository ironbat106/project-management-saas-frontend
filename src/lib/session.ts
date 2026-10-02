import "server-only";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, ORG_COOKIE, REFRESH_COOKIE } from "@/lib/constants";
import { cookieOptions, refreshLifetime } from "@/lib/session-shared";
import type { AuthTokens } from "@/types";

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function setSession(tokens: AuthTokens) {
  const store = await cookies();
  const maxAge = refreshLifetime(tokens.refreshToken);

  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(maxAge));
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(maxAge));
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(ORG_COOKIE);
}
