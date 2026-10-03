import type { ReactNode } from "react";
import { requireRole } from "@/lib/current-user";

export default async function OwnerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("OWNER");
  return children;
}
