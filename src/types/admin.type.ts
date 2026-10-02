import type { UserSummary } from "./user.type";

export interface PlatformStats {
  totalUsers: number;
  totalOrganizations: number;
  totalProjects: number;
  totalTasks: number;
  paidOrganizations: number;
  fromCache: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: UserSummary;
  organization: { id: string; name: string };
}

export interface ChartDatum {
  label: string;
  value: number;
}
