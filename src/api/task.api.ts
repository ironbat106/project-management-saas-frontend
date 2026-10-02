import type {
  Comment,
  ListParams,
  Requester,
  Subtask,
  Task,
  TaskDetail,
  TaskPriority,
  TaskStatus,
} from "@/types";

export interface TaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  sprintId?: string;
  assigneeId?: string;
  dueDate?: string;
}

const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];
const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

async function myCount(request: Requester, query: Record<string, string>) {
  const response = await request<Task[]>("/tasks/my-tasks", {
    query: { ...query, limit: 1 },
  });
  return response.meta?.total ?? 0;
}

export const taskApi = {
  list: (request: Requester, projectId: string, params: ListParams = {}) =>
    request<Task[]>(`/projects/${projectId}/tasks`, { query: params }),

  mine: (request: Requester, params: ListParams = {}) =>
    request<Task[]>("/tasks/my-tasks", { query: params }),

  // Counts by status and by priority for the member progress page.
  myOverview: async (request: Requester) => {
    const [byStatus, byPriority] = await Promise.all([
      Promise.all(TASK_STATUSES.map((status) => myCount(request, { status }))),
      Promise.all(
        TASK_PRIORITIES.map((priority) => myCount(request, { priority })),
      ),
    ]);

    return {
      success: true,
      message: "Overview fetched",
      data: {
        byStatus: TASK_STATUSES.map((status, index) => ({
          status,
          value: byStatus[index],
        })),
        byPriority: TASK_PRIORITIES.map((priority, index) => ({
          priority,
          value: byPriority[index],
        })),
      },
    };
  },

  get: (request: Requester, id: string) => request<TaskDetail>(`/tasks/${id}`),

  create: (request: Requester, projectId: string, body: TaskPayload) =>
    request<Task>(`/projects/${projectId}/tasks`, { method: "POST", body }),

  update: (request: Requester, id: string, body: TaskPayload) =>
    request<Task>(`/tasks/${id}`, { method: "PATCH", body }),

  updateStatus: (request: Requester, id: string, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, { method: "PATCH", body: { status } }),

  assign: (request: Requester, id: string, assigneeId: string) =>
    request<Task>(`/tasks/${id}/assign`, {
      method: "POST",
      body: { assigneeId },
    }),

  remove: (request: Requester, id: string) =>
    request<null>(`/tasks/${id}`, { method: "DELETE" }),

  createSubtask: (request: Requester, id: string, title: string) =>
    request<Subtask>(`/tasks/${id}/subtasks`, {
      method: "POST",
      body: { title },
    }),

  toggleSubtask: (request: Requester, subtaskId: string) =>
    request<Subtask>(`/subtasks/${subtaskId}`, { method: "PATCH" }),

  addComment: (request: Requester, id: string, content: string) =>
    request<Comment>(`/tasks/${id}/comments`, {
      method: "POST",
      body: { content },
    }),
};
