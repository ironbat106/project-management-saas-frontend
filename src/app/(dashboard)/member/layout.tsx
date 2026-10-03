import type { ReactNode } from "react";
import { requireRole } from "@/lib/current-user";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("MEMBER");
  return children;
}
