"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/url-state.hook";
import type { Meta } from "@/types";

function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "gap", total];
  if (current >= total - 3)
    return [1, "gap", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "gap", current - 1, current, current + 1, "gap", total];
}

export function UrlPagination({ meta }: { meta?: Meta }) {
  const { setParams } = useUrlParams();

  if (!meta || meta.totalPages <= 1) return null;

  const go = (page: number) => setParams({ page }, { keepPage: true });

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}, {meta.total} results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => go(meta.page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        {pageList(meta.page, meta.totalPages).map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-muted-foreground"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Button
              key={item}
              variant={item === meta.page ? "default" : "ghost"}
              size="sm"
              aria-current={item === meta.page ? "page" : undefined}
              onClick={() => go(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => go(meta.page + 1)}
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
