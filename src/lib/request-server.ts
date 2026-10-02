import "server-only";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/session";
import type { RequestOptions } from "@/types";

export async function serverRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const token = await getAccessToken();
  return backendFetch<T>(path, { ...options, token });
}
