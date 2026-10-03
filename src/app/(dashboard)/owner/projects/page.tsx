import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { projectApi } from "@/api";
import { NoOrganization } from "@/components/owner/no-organization";
import { ProjectsView } from "@/components/owner/projects-view";
import { PageHeader } from "@/components/shared/page-header";
import { getActiveOrganization } from "@/lib/active-org";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { active } = await getActiveOrganization();

  const header = (
    <PageHeader
      title="Projects"
      description="Every project in this organization. Search, filter and open one to plan its sprints and tasks."
    />
  );

  if (!active) {
    return (
      <>
        {header}
        <NoOrganization />
      </>
    );
  }

  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.projects.filters,
    LIST.projects.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.org.projects(active.id, params),
      queryFn: () => projectApi.list(serverRequest, active.id, params),
    },
  ]);

  return (
    <>
      {header}
      <HydrationBoundary state={state}>
        <ProjectsView orgId={active.id} />
      </HydrationBoundary>
    </>
  );
}
