import type { ListDefaults } from "@/lib/list-params";

interface ListConfig {
  filters: string[];
  defaults: ListDefaults;
}

export const LIST = {
  users: {
    filters: ["role", "status"],
    defaults: { limit: 10, allowedSort: ["createdAt", "name", "email"] },
  },
  adminOrganizations: {
    filters: ["subscriptionPlan"],
    defaults: { limit: 10, allowedSort: ["createdAt", "name"] },
  },
  auditLogs: {
    filters: ["entityType"],
    defaults: { limit: 15 },
  },
  ownerOrganizations: {
    filters: [],
    defaults: { limit: 10, allowedSort: ["createdAt", "name"] },
  },
  projects: {
    filters: ["status", "teamId"],
    defaults: { limit: 9, allowedSort: ["createdAt", "name", "endDate"] },
  },
  projectTasks: {
    filters: ["status", "priority", "sprintId", "assigneeId"],
    defaults: { limit: 10, allowedSort: ["createdAt", "dueDate", "title"] },
  },
  members: {
    filters: [],
    defaults: { limit: 10, sortBy: "joinedAt", allowedSort: ["joinedAt"] },
  },
  teams: {
    filters: [],
    defaults: { limit: 6, allowedSort: ["createdAt", "name"] },
  },
  payments: {
    filters: [],
    defaults: { limit: 10, allowedSort: ["createdAt"] },
  },
  myTasks: {
    filters: ["status", "priority"],
    defaults: { limit: 10, allowedSort: ["createdAt", "dueDate", "title"] },
  },
} satisfies Record<string, ListConfig>;
