import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return format(parseISO(value), "d MMM yyyy");
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Not set";
  return format(parseISO(value), "d MMM yyyy, h:mm a");
}

export function timeAgo(value: string) {
  return formatDistanceToNow(parseISO(value), { addSuffix: true });
}

export function formatLabel(value: string) {
  const text = value.replaceAll("_", " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatMoney(value: string | number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(value));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function toIsoDate(value?: string) {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}
