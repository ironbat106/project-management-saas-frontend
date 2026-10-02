import {
  Building2,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
  ScrollText,
  TrendingUp,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const NAVIGATION: Record<Role, { title: string; items: NavItem[] }> = {
  ADMIN: {
    title: "Administration",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/organizations", label: "Organizations", icon: Building2 },
      { href: "/admin/audit-logs", label: "Audit log", icon: ScrollText },
      { href: "/profile", label: "Profile", icon: UserRound },
    ],
  },
  OWNER: {
    title: "Workspace",
    items: [
      { href: "/owner", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/owner/projects", label: "Projects", icon: FolderKanban },
      { href: "/owner/teams", label: "Teams", icon: UsersRound },
      { href: "/owner/members", label: "Members", icon: Users },
      { href: "/owner/billing", label: "Billing", icon: CreditCard },
      { href: "/owner/organizations", label: "Organizations", icon: Building2 },
      { href: "/profile", label: "Profile", icon: UserRound },
    ],
  },
  MEMBER: {
    title: "My work",
    items: [
      { href: "/member", label: "My tasks", icon: ListChecks, exact: true },
      { href: "/member/progress", label: "Progress", icon: TrendingUp },
      { href: "/profile", label: "Profile", icon: UserRound },
    ],
  },
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  OWNER: "Owner",
  MEMBER: "Member",
};
