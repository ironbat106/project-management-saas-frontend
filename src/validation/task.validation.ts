import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must be at least 2 characters long")
    .max(200, "Task title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  sprintId: z.string(),
  assigneeId: z.string(),
  dueDate: z.string(),
});

export const subtaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Subtask title is required")
    .max(200, "Subtask title must be 200 characters or fewer"),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1000 characters or fewer"),
});

export type TaskValues = z.infer<typeof taskSchema>;
