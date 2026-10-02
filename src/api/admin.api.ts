import type {
  ActivityLog,
  ListParams,
  Organization,
  PlatformStats,
  Requester,
  User,
} from "@/types";

const ROLES = ["ADMIN", "OWNER", "MEMBER"] as const;
const PLANS = ["FREE", "PRO", "BUSINESS"] as const;

async function userCount(request: Requester, role: string) {
  const response = await request<User[]>("/admin/users", {
    query: { role, limit: 1 },
  });
  return response.meta?.total ?? 0;
}

async function orgCount(request: Requester, subscriptionPlan: string) {
  const response = await request<Organization[]>("/admin/organizations", {
    query: { subscriptionPlan, limit: 1 },
  });
  return response.meta?.total ?? 0;
}

export const adminApi = {
  stats: (request: Requester) =>
    request<PlatformStats>("/admin/dashboard-stats"),

  // Platform stats plus exact counts for the charts. Each count uses the
  // "total" value from a request with limit=1, so no large lists are loaded.
  overview: async (request: Requester) => {
    const [stats, roleCounts, planCounts] = await Promise.all([
      adminApi.stats(request),
      Promise.all(ROLES.map((role) => userCount(request, role))),
      Promise.all(PLANS.map((plan) => orgCount(request, plan))),
    ]);

    return {
      success: true,
      message: "Overview fetched",
      data: {
        stats: stats.data,
        usersByRole: ROLES.map((role, index) => ({
          label: role.charAt(0) + role.slice(1).toLowerCase(),
          value: roleCounts[index],
        })),
        orgsByPlan: PLANS.map((plan, index) => ({
          label: plan.charAt(0) + plan.slice(1).toLowerCase(),
          value: planCounts[index],
        })),
      },
    };
  },

  users: (request: Requester, params: ListParams = {}) =>
    request<User[]>("/admin/users", { query: params }),

  setUserStatus: (
    request: Requester,
    id: string,
    status: "ACTIVE" | "BLOCKED",
  ) =>
    request<User>(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  organizations: (request: Requester, params: ListParams = {}) =>
    request<Organization[]>("/admin/organizations", { query: params }),

  auditLogs: (request: Requester, params: ListParams = {}) =>
    request<ActivityLog[]>("/admin/audit-logs", { query: params }),
};
