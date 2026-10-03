import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { taskApi } from "@/api";
import { ApiError } from "@/lib/api-error";
import { getCurrentUser } from "@/lib/current-user";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";
import { TaskDetail } from "./task-detail";

export async function TaskPage({ taskId }: { taskId: string }) {
  const user = await getCurrentUser();

  let task: Awaited<ReturnType<typeof taskApi.get>>;
  try {
    task = await taskApi.get(serverRequest, taskId);
  } catch (error) {
    if (error instanceof ApiError && [400, 403, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }

  const state = await prefetch([
    { queryKey: queryKeys.task.detail(taskId), queryFn: async () => task },
  ]);

  return (
    <HydrationBoundary state={state}>
      <TaskDetail taskId={taskId} role={user.role} userId={user.id} />
    </HydrationBoundary>
  );
}
