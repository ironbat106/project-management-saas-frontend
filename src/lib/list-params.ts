import type { ListParams } from "@/types";

interface ParamSource {
  get(key: string): string | null | undefined;
}

export interface ListDefaults {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  allowedSort?: string[];
}

export function buildListParams(
  source: ParamSource,
  filterKeys: string[] = [],
  defaults: ListDefaults = {},
): ListParams {
  const page = Number(source.get("page"));
  const sortBy = source.get("sortBy");
  const sortOrder = source.get("sortOrder");

  const params: ListParams = {
    page: page > 0 ? Math.floor(page) : 1,
    limit: defaults.limit ?? 10,
    sortBy:
      sortBy && (defaults.allowedSort ?? []).includes(sortBy)
        ? sortBy
        : defaults.sortBy,
    sortOrder:
      sortOrder === "asc" || sortOrder === "desc"
        ? sortOrder
        : defaults.sortOrder,
  };

  const q = source.get("q");
  if (q) params.searchTerm = q;

  for (const key of filterKeys) {
    const value = source.get(key);
    if (value) params[key] = value;
  }

  return params;
}

export function fromSearchParamsObject(
  searchParams: Record<string, string | string[] | undefined>,
): ParamSource {
  return {
    get: (key) => {
      const value = searchParams[key];
      return Array.isArray(value) ? value[0] : value;
    },
  };
}
