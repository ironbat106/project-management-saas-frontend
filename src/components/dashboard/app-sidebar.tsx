"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import { Logo } from "@/components/shared/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitials } from "@/lib/format";
import { NAVIGATION, ROLE_LABEL } from "@/lib/navigation";
import type { Organization, User } from "@/types";
import { OrgSwitcher } from "./org-switcher";

interface Props {
  user: User;
  organizations: Organization[];
  activeOrganizationId?: string;
}

export function AppSidebar({
  user,
  organizations,
  activeOrganizationId,
}: Props) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const navigation = NAVIGATION[user.role];

  return (
    <Sidebar>
      <SidebarHeader className="gap-4 p-4">
        <Logo href={navigation.items[0].href} />
        {user.role === "OWNER" ? (
          <OrgSwitcher
            organizations={organizations}
            activeId={activeOrganizationId}
          />
        ) : null}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{navigation.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {getInitials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ROLE_LABEL[user.role]}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
