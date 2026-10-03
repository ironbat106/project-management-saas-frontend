"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { buildListParams } from "@/lib/list-params";

type Updates = Record<string, string | number | undefined>;

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Updates, options: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      if (!options.keepPage && !("page" in updates)) {
        next.delete("page");
      }

      const query = next.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const hrefFor = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      const query = next.toString();

      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  return { searchParams, setParams, hrefFor };
}

export function useListParams(
  filterKeys: string[] = [],
  defaults: Parameters<typeof buildListParams>[2] = {},
) {
  const searchParams = useSearchParams();

  return useMemo(
    () => buildListParams(searchParams, filterKeys, defaults),
    [searchParams, filterKeys, defaults],
  );
}
