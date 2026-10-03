import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { teamApi } from "@/api";
import { NoOrganization } from "@/components/owner/no-organization";
import { TeamsView } from "@/components/owner/teams-view";
import { PageHeader } from "@/components/shared/page-header";
import { getActiveOrganization } from "@/lib/active-org";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { active } = await getActiveOrganization();

  const header = (
    <PageHeader
      title="Teams"
      description="Group members into teams and link projects to them."
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
    LIST.teams.filters,
    LIST.teams.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.org.teams(active.id, params),
      queryFn: () => teamApi.list(serverRequest, active.id, params),
    },
  ]);

  return (
    <>
      {header}
      <HydrationBoundary state={state}>
        <TeamsView orgId={active.id} />
      </HydrationBoundary>
    </>
  );
}
