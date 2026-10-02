import type { Role, UserStatus, UserSummary } from "./user.type";

export type SubscriptionPlan = "FREE" | "PRO" | "BUSINESS";
export type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PAST_DUE"
  | "CANCELLED";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: UserSummary;
  _count?: { members: number; projects: number; teams: number };
}

export interface OrganizationMember {
  id: string;
  joinedAt: string;
  userId: string;
  organizationId: string;
  user: UserSummary & { role: Role; status: UserStatus };
}

export interface InviteMemberResult {
  membership: OrganizationMember;
  invitedUser: UserSummary;
  // Only present the first time a brand new account is created.
  temporaryPassword: string | null;
}

export interface TeamMember {
  id: string;
  userId: string;
  addedAt: string;
  user: UserSummary;
}

export interface Team {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  _count: { members: number; projects: number };
  members: TeamMember[];
}

export interface OrganizationStats {
  totalMembers: number;
  totalTeams: number;
  totalProjects: number;
  tasksByStatus: { status: string; count: number }[];
  fromCache: boolean;
}
