"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { backendFetch } from "@/lib/backend";
import { ORG_COOKIE, ROLE_HOME } from "@/lib/constants";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSession,
} from "@/lib/session";
import { cookieOptions } from "@/lib/session-shared";
import type { ActionResult, DemoRole, LoginResult, Role, User } from "@/types";
import {
  type LoginValues,
  loginSchema,
  type RegisterValues,
  registerSchema,
} from "@/validation";

function pickRedirect(role: Role, next?: string) {
  const home = ROLE_HOME[role];
  if (next?.startsWith(home) || next === "/profile") return next;
  return home;
}

function toResult(error: unknown, fallback: string): ActionResult {
  return {
    ok: false,
    message: error instanceof ApiError ? error.message : fallback,
  };
}

async function signIn(
  values: LoginValues,
  next?: string,
): Promise<ActionResult> {
  const login = await backendFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: values,
  });

  await setSession(login.data);

  const me = await backendFetch<User>("/users/me", {
    token: login.data.accessToken,
  });

  return { ok: true, redirectTo: pickRedirect(me.data.role, next) };
}

export async function loginAction(
  values: LoginValues,
  next?: string,
): Promise<ActionResult> {
  // Validate again on the server. Client checks can be skipped.
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  try {
    return await signIn(parsed.data, next);
  } catch (error) {
    return toResult(error, "Could not log you in. Please try again.");
  }
}

export async function demoLoginAction(role: DemoRole): Promise<ActionResult> {
  const email = process.env[`DEMO_${role.toUpperCase()}_EMAIL`];
  const password = process.env[`DEMO_${role.toUpperCase()}_PASSWORD`];

  if (!email || !password) {
    return { ok: false, message: "This demo account is not configured." };
  }

  try {
    return await signIn({ email, password });
  } catch (error) {
    return toResult(error, "Could not log in to the demo account.");
  }
}

export async function registerAction(
  values: RegisterValues,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  try {
    const { name, email, password } = parsed.data;
    const response = await backendFetch<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/register", { method: "POST", body: { name, email, password } });

    await setSession(response.data);
    return { ok: true, redirectTo: ROLE_HOME.OWNER };
  } catch (error) {
    return toResult(error, "Could not create your account. Please try again.");
  }
}

export async function logoutAction() {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken && refreshToken) {
    try {
      await backendFetch("/auth/logout", {
        method: "POST",
        token: accessToken,
        body: { refreshToken },
      });
    } catch {}
  }

  await clearSession();
  redirect("/login");
}

export async function switchOrganizationAction(organizationId: string) {
  (await cookies()).set(
    ORG_COOKIE,
    organizationId,
    cookieOptions(60 * 60 * 24 * 30),
  );
  revalidatePath("/owner", "layout");
}
