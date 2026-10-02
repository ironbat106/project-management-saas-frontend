import { ApiError } from "@/lib/api-error";
import { buildQuery } from "@/lib/query-string";
import type { ApiEnvelope, RequestOptions } from "@/types";

export async function browserRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(`/api/proxy${path}${buildQuery(options.query)}`, {
      method: options.method ?? "GET",
      headers: { "Content-Type": "application/json" },
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Network error. Check your connection and try again.",
      0,
    );
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
