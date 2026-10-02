export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends AuthTokens {
  needPasswordChange: boolean;
}

export type DemoRole = "admin" | "owner" | "member";

export interface ActionResult {
  ok: boolean;
  message?: string;
  redirectTo?: string;
}
