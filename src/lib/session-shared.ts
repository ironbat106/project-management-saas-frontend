import { decodeJwt } from "jose";
import type { Role } from "@/types";

export interface TokenClaims {
  userId: string;
  role: Role;
  exp: number;
}


export function readClaims(token?: string): TokenClaims | null {
  if (!token) return null;

  try {
    const claims = decodeJwt(token);
    if (!claims.exp || typeof claims.role !== "string") return null;
    return {
      userId: String(claims.userId),
      role: claims.role as Role,
      exp: claims.exp,
    };
  } catch {
    return null;
  }
}

export function isExpired(claims: TokenClaims | null, skewSeconds = 15) {
  if (!claims) return true;
  return claims.exp * 1000 < Date.now() + skewSeconds * 1000;
}

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function refreshLifetime(refreshToken: string) {
  const claims = readClaims(refreshToken);
  const seconds = claims ? claims.exp - Math.floor(Date.now() / 1000) : 0;
  return seconds > 0 ? seconds : 60 * 60 * 24;
}
