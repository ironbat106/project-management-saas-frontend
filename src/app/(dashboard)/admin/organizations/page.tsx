import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { adminApi } from "@/api";
import { AdminOrganizationsView } from "@/components/admin/organizations-view";
import { PageHeader } from "@/components/shared/page-header";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Organizations" };

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.adminOrganizations.filters,
    LIST.adminOrganizations.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.admin.organizations(params),
      queryFn: () => adminApi.organizations(serverRequest, params),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Every workspace on the platform with its owner, plan and size."
      />
      <HydrationBoundary state={state}>
        <AdminOrganizationsView />
      </HydrationBoundary>
    </>
  );
}
