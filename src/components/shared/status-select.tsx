"use client";

import { formatLabel } from "@/lib/format";
import { StatusBadge } from "./status-badge";

interface Props<T extends string> {
  current: T;
  next: T[];
  onChange: (status: T) => void;
  label: string;
  disabled?: boolean;
}

export function StatusSelect<T extends string>({
  current,
  next,
  onChange,
  label,
  disabled,
}: Props<T>) {
  if (next.length === 0) return <StatusBadge value={current} />;

  return (
    <select
      aria-label={label}
      value={current}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
      className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
    >
      <option value={current}>{formatLabel(current)}</option>
      {next.map((status) => (
        <option key={status} value={status}>
          Move to {formatLabel(status).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
