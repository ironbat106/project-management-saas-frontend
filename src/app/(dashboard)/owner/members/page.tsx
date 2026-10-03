import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { organizationApi } from "@/api";
import { MembersView } from "@/components/owner/members-view";
import { NoOrganization } from "@/components/owner/no-organization";
import { PageHeader } from "@/components/shared/page-header";
import { getActiveOrganization } from "@/lib/active-org";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { active } = await getActiveOrganization();

  const header = (
    <PageHeader
      title="Members"
      description="The people who belong to this organization."
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
    LIST.members.filters,
    LIST.members.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.org.members(active.id, params),
      queryFn: () => organizationApi.members(serverRequest, active.id, params),
    },
  ]);

  return (
    <>
      {header}
      <HydrationBoundary state={state}>
        <MembersView orgId={active.id} ownerId={active.ownerId} />
      </HydrationBoundary>
    </>
  );
}
