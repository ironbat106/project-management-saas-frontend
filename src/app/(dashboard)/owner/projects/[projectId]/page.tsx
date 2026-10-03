import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectApi, sprintApi, taskApi } from "@/api";
import { ProjectDetail } from "@/components/owner/project-detail";
import { ApiError } from "@/lib/api-error";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectId } = await params;

  // If the project does not exist or is not ours, show the 404 page.
  let project: Awaited<ReturnType<typeof projectApi.get>>;
  try {
    project = await projectApi.get(serverRequest, projectId);
  } catch (error) {
    if (error instanceof ApiError && [400, 403, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }

  const taskParams = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.projectTasks.filters,
    LIST.projectTasks.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.project.detail(projectId),
      queryFn: async () => project,
    },
    {
      queryKey: queryKeys.project.tasks(projectId, taskParams),
      queryFn: () => taskApi.list(serverRequest, projectId, taskParams),
    },
    {
      queryKey: queryKeys.project.sprints(projectId),
      queryFn: () => sprintApi.list(serverRequest, projectId),
    },
  ]);

  return (
    <HydrationBoundary state={state}>
      <ProjectDetail
        orgId={project.data.organizationId}
        projectId={projectId}
      />
    </HydrationBoundary>
  );
}
