import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { organizationApi } from "@/api";
import { OwnerOrganizationsView } from "@/components/owner/organizations-view";
import { PageHeader } from "@/components/shared/page-header";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Organizations" };

export default async function OwnerOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.ownerOrganizations.filters,
    LIST.ownerOrganizations.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.organizations.list(params),
      queryFn: () => organizationApi.list(serverRequest, params),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Create, rename and delete the workspaces you own. Use the switcher in the sidebar to choose which one you are working in."
      />
      <HydrationBoundary state={state}>
        <OwnerOrganizationsView />
      </HydrationBoundary>
    </>
  );
}
