import type {
  InviteMemberResult,
  ListParams,
  Organization,
  OrganizationMember,
  OrganizationStats,
  Project,
  Requester,
  Team,
} from "@/types";

export const organizationApi = {
  list: (request: Requester, params: ListParams = {}) =>
    request<Organization[]>("/organizations", { query: params }),

  create: (request: Requester, body: { name: string; description?: string }) =>
    request<Organization>("/organizations", { method: "POST", body }),

  update: (
    request: Requester,
    id: string,
    body: { name?: string; description?: string },
  ) => request<Organization>(`/organizations/${id}`, { method: "PATCH", body }),

  remove: (request: Requester, id: string) =>
    request<null>(`/organizations/${id}`, { method: "DELETE" }),

  stats: (request: Requester, id: string) =>
    request<OrganizationStats>(`/organizations/${id}/dashboard-stats`),

  overview: async (request: Requester, id: string) => {
    const [stats, active, completed, archived] = await Promise.all([
      organizationApi.stats(request, id),
      projectCount(request, id, "ACTIVE"),
      projectCount(request, id, "COMPLETED"),
      projectCount(request, id, "ARCHIVED"),
    ]);

    return {
      success: true,
      message: "Overview fetched",
      data: {
        stats: stats.data,
        projectsByStatus: [
          { label: "Active", value: active },
          { label: "Completed", value: completed },
          { label: "Archived", value: archived },
        ],
      },
    };
  },

  members: (request: Requester, id: string, params: ListParams = {}) =>
    request<OrganizationMember[]>(`/organizations/${id}/members`, {
      query: { sortBy: "joinedAt", ...params },
    }),

  invite: (
    request: Requester,
    id: string,
    body: { name: string; email: string },
  ) =>
    request<InviteMemberResult>(`/organizations/${id}/members`, {
      method: "POST",
      body,
    }),

  removeMember: (request: Requester, id: string, memberId: string) =>
    request<null>(`/organizations/${id}/members/${memberId}`, {
      method: "DELETE",
    }),
};

async function projectCount(request: Requester, id: string, status: string) {
  const response = await request<Project[]>(`/organizations/${id}/projects`, {
    query: { status, limit: 1 },
  });
  return response.meta?.total ?? 0;
}

export const teamApi = {
  list: (request: Requester, orgId: string, params: ListParams = {}) =>
    request<Team[]>(`/organizations/${orgId}/teams`, { query: params }),

  create: (request: Requester, orgId: string, body: { name: string }) =>
    request<Team>(`/organizations/${orgId}/teams`, { method: "POST", body }),

  addMember: (request: Requester, teamId: string, userId: string) =>
    request<unknown>(`/teams/${teamId}/members`, {
      method: "POST",
      body: { userId },
    }),

  removeMember: (request: Requester, teamId: string, userId: string) =>
    request<null>(`/teams/${teamId}/members/${userId}`, { method: "DELETE" }),
};
