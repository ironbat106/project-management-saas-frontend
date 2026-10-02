export function buildQuery(
  query?: Record<string, string | number | undefined>,
) {
  if (!query) return "";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }

  const text = params.toString();
  return text ? `?${text}` : "";
}
