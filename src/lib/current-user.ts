import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { userApi } from "@/api";
import { ApiError } from "@/lib/api-error";
import { ROLE_HOME } from "@/lib/constants";
import { serverRequest } from "@/lib/request-server";
import type { Role } from "@/types";


export const getCurrentUser = cache(async () => {
  try {
    const response = await userApi.me(serverRequest);
    return response.data;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/api/auth/clear");
    }
    throw error;
  }
});

export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (user.role !== role) redirect(ROLE_HOME[user.role]);
  return user;
}
