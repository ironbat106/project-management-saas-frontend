import { ApiError } from "@/lib/api-error";
import { buildQuery } from "@/lib/query-string";
import type { ApiEnvelope, RequestOptions } from "@/types";

export function getApiBaseUrl() {
  const url = process.env.API_BASE_URL;
  if (!url) throw new Error("API_BASE_URL is not set in the environment");
  return url.replace(/\/$/, "");
}

// Talks to the Express backend. Only ever called on the server.
export async function backendFetch<T>(
  path: string,
  options: RequestOptions & { token?: string } = {},
): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}${path}${buildQuery(options.query)}`,
      {
        method: options.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.token
            ? { Authorization: `Bearer ${options.token}` }
            : {}),
        },
        body:
          options.body !== undefined ? JSON.stringify(options.body) : undefined,
        cache: "no-store",
      },
    );
  } catch {
    throw new ApiError("Could not reach the server. Please try again.", 503);
  }

  const json = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !json?.success) {
    throw new ApiError(
      json?.message ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  return json;
}
