import type { UserSummary } from "./user.type";

export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";
export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  organizationId: string;
  teamId: string | null;
  createdAt: string;
  team?: { id: string; name: string } | null;
  _count?: { tasks: number; sprints: number };
}

export interface Sprint {
  id: string;
  name: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  projectId: string;
  createdAt: string;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string;
  sprintId: string | null;
  assigneeId: string | null;
  createdAt: string;
  assignee?: UserSummary | null;
  sprint?: { id: string; name: string } | null;
  project?: { id: string; name: string; organizationId: string };
  _count?: { subtasks: number; comments: number };
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
}

export interface TaskDetail extends Omit<Task, "sprint" | "_count"> {
  createdBy: UserSummary;
  sprint: { id: string; name: string; status: SprintStatus } | null;
  subtasks: Subtask[];
  comments: Comment[];
}
