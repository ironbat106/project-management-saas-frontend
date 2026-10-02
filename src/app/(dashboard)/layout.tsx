import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getActiveOrganization } from "@/lib/active-org";
import { getCurrentUser } from "@/lib/current-user";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  const { organizations, active } =
    user.role === "OWNER"
      ? await getActiveOrganization()
      : { organizations: [], active: null };

  return (
    <DashboardShell
      user={user}
      organizations={organizations}
      activeOrganization={active}
    >
      {children}
    </DashboardShell>
  );
}
