"use client";

import { useUrlParams } from "@/hooks/url-state.hook";

interface SortOption {
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export function SortSelect({
  options,
  defaultIndex = 0,
}: {
  options: SortOption[];
  defaultIndex?: number;
}) {
  const { searchParams, setParams } = useUrlParams();

  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const currentIndex = options.findIndex(
    (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
  );

  return (
    <select
      aria-label="Sort"
      value={currentIndex === -1 ? defaultIndex : currentIndex}
      onChange={(event) => {
        const option = options[Number(event.target.value)];
        setParams({ sortBy: option.sortBy, sortOrder: option.sortOrder });
      }}
      className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {options.map((option, index) => (
        <option key={option.label} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
