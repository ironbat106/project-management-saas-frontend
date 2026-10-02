import { formatLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-sky-100 text-sky-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
};

// One place that decides the colour of every status in the app.
const STATUS_TONE: Record<string, Tone> = {
  // task
  TODO: "neutral",
  IN_PROGRESS: "info",
  IN_REVIEW: "warning",
  DONE: "success",
  // priority
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
  // project and sprint
  ACTIVE: "success",
  COMPLETED: "info",
  ARCHIVED: "neutral",
  PLANNED: "neutral",
  // user
  BLOCKED: "danger",
  DELETED: "danger",
  // payment
  PENDING: "warning",
  PAID: "success",
  FAILED: "danger",
  CANCELLED: "neutral",
  REFUNDED: "neutral",
  // plan and subscription
  FREE: "neutral",
  PRO: "info",
  BUSINESS: "success",
  INACTIVE: "neutral",
  PAST_DUE: "danger",
  // roles
  ADMIN: "danger",
  OWNER: "info",
  MEMBER: "neutral",
};

export function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONES[STATUS_TONE[value] ?? "neutral"],
        className,
      )}
    >
      {formatLabel(value)}
    </span>
  );
}
