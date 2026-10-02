import type {
  ListParams,
  Project,
  ProjectStatus,
  Requester,
  Sprint,
  SprintStatus,
} from "@/types";

export interface ProjectPayload {
  name?: string;
  description?: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
}

export const projectApi = {
  list: (request: Requester, orgId: string, params: ListParams = {}) =>
    request<Project[]>(`/organizations/${orgId}/projects`, { query: params }),

  get: (request: Requester, id: string) => request<Project>(`/projects/${id}`),

  create: (request: Requester, orgId: string, body: ProjectPayload) =>
    request<Project>(`/organizations/${orgId}/projects`, {
      method: "POST",
      body,
    }),

  update: (request: Requester, id: string, body: ProjectPayload) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body }),

  updateStatus: (request: Requester, id: string, status: ProjectStatus) =>
    request<Project>(`/projects/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  remove: (request: Requester, id: string) =>
    request<null>(`/projects/${id}`, { method: "DELETE" }),
};

export const sprintApi = {
  list: (request: Requester, projectId: string) =>
    request<Sprint[]>(`/projects/${projectId}/sprints`, {
      query: { limit: 50 },
    }),

  create: (
    request: Requester,
    projectId: string,
    body: { name: string; startDate: string; endDate: string },
  ) =>
    request<Sprint>(`/projects/${projectId}/sprints`, {
      method: "POST",
      body,
    }),

  updateStatus: (request: Requester, id: string, status: SprintStatus) =>
    request<Sprint>(`/sprints/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};
