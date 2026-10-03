"use client";

import {
  type Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { type TaskPayload, taskApi } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import { browserRequest } from "@/lib/request-browser";
import type {
  ApiEnvelope,
  ListParams,
  Task,
  TaskDetail,
  TaskStatus,
} from "@/types";

export function useProjectTasks(projectId: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.project.tasks(projectId, params),
    queryFn: () => taskApi.list(browserRequest, projectId, params),
    placeholderData: (previous) => previous,
  });
}

export function useMyTasks(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.task.mine(params),
    queryFn: () => taskApi.mine(browserRequest, params),
    placeholderData: (previous) => previous,
  });
}

export function useMyOverview() {
  return useQuery({
    queryKey: queryKeys.task.myOverview,
    queryFn: () => taskApi.myOverview(browserRequest),
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: queryKeys.task.detail(taskId),
    queryFn: () => taskApi.get(browserRequest, taskId),
  });
}

const isTaskList = (query: Query) =>
  (query.queryKey[0] === "project" && query.queryKey[2] === "tasks") ||
  (query.queryKey[0] === "my-tasks" && query.queryKey[1] !== "overview");

export function useCreateTask(projectId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (body: TaskPayload) =>
      taskApi.create(browserRequest, projectId, body),
    onSuccess: () => {
      toast.success("Task created");
      client.invalidateQueries({ queryKey: queryKeys.project.root(projectId) });
      client.invalidateQueries({ queryKey: ["org"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; status: TaskStatus }) =>
      taskApi.updateStatus(browserRequest, input.id, input.status),
    onMutate: async ({ id, status }) => {
      await client.cancelQueries({ predicate: isTaskList });
      await client.cancelQueries({ queryKey: queryKeys.task.detail(id) });

      const listSnapshots = client.getQueriesData<ApiEnvelope<Task[]>>({
        predicate: isTaskList,
      });
      const detailSnapshot = client.getQueryData<ApiEnvelope<TaskDetail>>(
        queryKeys.task.detail(id),
      );

      client.setQueriesData<ApiEnvelope<Task[]>>(
        { predicate: isTaskList },
        (old) =>
          old && {
            ...old,
            data: old.data.map((task) =>
              task.id === id ? { ...task, status } : task,
            ),
          },
      );
      client.setQueryData<ApiEnvelope<TaskDetail>>(
        queryKeys.task.detail(id),
        (old) => old && { ...old, data: { ...old.data, status } },
      );

      return { listSnapshots, detailSnapshot, id };
    },
    onError: (_error, _input, context) => {
      for (const [key, data] of context?.listSnapshots ?? []) {
        client.setQueryData(key, data);
      }
      if (context?.detailSnapshot) {
        client.setQueryData(
          queryKeys.task.detail(context.id),
          context.detailSnapshot,
        );
      }
    },
    onSuccess: () => toast.success("Task status updated"),
    onSettled: (_data, _error, input) => {
      client.invalidateQueries({ predicate: isTaskList });
      client.invalidateQueries({ queryKey: queryKeys.task.detail(input.id) });
      client.invalidateQueries({ queryKey: queryKeys.task.myOverview });
    },
  });
}

export function useUpdateTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; body: TaskPayload }) =>
      taskApi.update(browserRequest, input.id, input.body),
    onSuccess: (_data, input) => {
      toast.success("Task updated");
      client.invalidateQueries({ predicate: isTaskList });
      client.invalidateQueries({ queryKey: queryKeys.task.detail(input.id) });
    },
  });
}

export function useAssignTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; assigneeId: string }) =>
      taskApi.assign(browserRequest, input.id, input.assigneeId),
    onSuccess: (_data, input) => {
      toast.success("Task assigned");
      client.invalidateQueries({ predicate: isTaskList });
      client.invalidateQueries({ queryKey: queryKeys.task.detail(input.id) });
    },
  });
}

export function useDeleteTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.remove(browserRequest, id),
    onSuccess: () => {
      toast.success("Task deleted");
      client.invalidateQueries({ predicate: isTaskList });
    },
  });
}

export function useCreateSubtask(taskId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      taskApi.createSubtask(browserRequest, taskId, title),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.task.detail(taskId) }),
  });
}

export function useToggleSubtask(taskId: string) {
  const client = useQueryClient();
  const key = queryKeys.task.detail(taskId);

  return useMutation({
    mutationFn: (subtaskId: string) =>
      taskApi.toggleSubtask(browserRequest, subtaskId),
    onMutate: async (subtaskId) => {
      await client.cancelQueries({ queryKey: key });
      const snapshot = client.getQueryData<ApiEnvelope<TaskDetail>>(key);

      client.setQueryData<ApiEnvelope<TaskDetail>>(
        key,
        (old) =>
          old && {
            ...old,
            data: {
              ...old.data,
              subtasks: old.data.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, isCompleted: !subtask.isCompleted }
                  : subtask,
              ),
            },
          },
      );

      return { snapshot };
    },
    onError: (_error, _id, context) => {
      if (context?.snapshot) client.setQueryData(key, context.snapshot);
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useAddComment(taskId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      taskApi.addComment(browserRequest, taskId, content),
    onSuccess: () => {
      toast.success("Comment added");
      client.invalidateQueries({ queryKey: queryKeys.task.detail(taskId) });
    },
  });
}
