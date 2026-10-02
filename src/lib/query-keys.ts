import type { ListParams } from "@/types";

export const queryKeys = {
  admin: {
    overview: ["admin", "overview"] as const,
    users: (params: ListParams) => ["admin", "users", params] as const,
    organizations: (params: ListParams) =>
      ["admin", "organizations", params] as const,
    auditLogs: (params: ListParams) => ["admin", "audit-logs", params] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    list: (params: ListParams) => ["organizations", "list", params] as const,
  },
  org: {
    root: (id: string) => ["org", id] as const,
    overview: (id: string) => ["org", id, "overview"] as const,
    members: (id: string, params: ListParams) =>
      ["org", id, "members", params] as const,
    teams: (id: string, params: ListParams) =>
      ["org", id, "teams", params] as const,
    projects: (id: string, params: ListParams) =>
      ["org", id, "projects", params] as const,
    payments: (id: string, params: ListParams) =>
      ["org", id, "payments", params] as const,
  },
  project: {
    root: (id: string) => ["project", id] as const,
    detail: (id: string) => ["project", id, "detail"] as const,
    tasks: (id: string, params: ListParams) =>
      ["project", id, "tasks", params] as const,
    sprints: (id: string) => ["project", id, "sprints"] as const,
  },
  task: {
    detail: (id: string) => ["task", id] as const,
    mine: (params: ListParams) => ["my-tasks", params] as const,
    myOverview: ["my-tasks", "overview"] as const,
  },
};
