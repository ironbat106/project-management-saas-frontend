import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { taskApi } from "@/api";
import { ProgressView } from "@/components/member/progress-view";
import { PageHeader } from "@/components/shared/page-header";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  const state = await prefetch([
    {
      queryKey: queryKeys.task.myOverview,
      queryFn: () => taskApi.myOverview(serverRequest),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Progress"
        description="A summary of your assigned tasks by status and priority."
      />
      <HydrationBoundary state={state}>
        <ProgressView />
      </HydrationBoundary>
    </>
  );
}
