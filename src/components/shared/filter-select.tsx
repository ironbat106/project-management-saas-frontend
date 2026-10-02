"use client";

import { useUrlParams } from "@/hooks/url-state.hook";
import { formatLabel } from "@/lib/format";

interface Props {
  param: string;
  label: string;
  options: string[];
  allLabel?: string;
}

export function FilterSelect({ param, label, options, allLabel }: Props) {
  const { searchParams, setParams } = useUrlParams();

  return (
    <select
      aria-label={label}
      value={searchParams.get(param) ?? ""}
      onChange={(event) => setParams({ [param]: event.target.value })}
      className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <option value="">{allLabel ?? `All ${label.toLowerCase()}`}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatLabel(option)}
        </option>
      ))}
    </select>
  );
}
