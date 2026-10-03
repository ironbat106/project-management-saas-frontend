import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { taskApi } from "@/api";
import { MyTasksView } from "@/components/member/my-tasks-view";
import { PageHeader } from "@/components/shared/page-header";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "My tasks" };

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.myTasks.filters,
    LIST.myTasks.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.task.mine(params),
      queryFn: () => taskApi.mine(serverRequest, params),
    },
  ]);

  return (
    <>
      <PageHeader
        title="My tasks"
        description="Everything assigned to you. Move a task forward as you work on it, or open it for subtasks and comments."
      />
      <HydrationBoundary state={state}>
        <MyTasksView />
      </HydrationBoundary>
    </>
  );
}
