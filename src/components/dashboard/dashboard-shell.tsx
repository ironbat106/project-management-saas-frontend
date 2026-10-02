import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLE_LABEL } from "@/lib/navigation";
import type { Organization, User } from "@/types";
import { AppSidebar } from "./app-sidebar";

interface Props {
  user: User;
  organizations: Organization[];
  activeOrganization: Organization | null;
  children: ReactNode;
}

export function DashboardShell({
  user,
  organizations,
  activeOrganization,
  children,
}: Props) {
  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        organizations={organizations}
        activeOrganizationId={activeOrganization?.id}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger aria-label="Toggle navigation" />
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm text-muted-foreground">
            {ROLE_LABEL[user.role]} area
            {user.role === "OWNER" && activeOrganization
              ? `, ${activeOrganization.name}`
              : ""}
          </p>
        </header>
        <main id="main" className="flex-1 space-y-6 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
