import type { Metadata } from "next";
import { TaskPage } from "@/components/tasks/task-page";

export const metadata: Metadata = { title: "Task" };

export default async function OwnerTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  return <TaskPage taskId={taskId} />;
}
