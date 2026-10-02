import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { adminApi } from "@/api";
import { UsersView } from "@/components/admin/users-view";
import { PageHeader } from "@/components/shared/page-header";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.users.filters,
    LIST.users.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.admin.users(params),
      queryFn: () => adminApi.users(serverRequest, params),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Search every account, filter by role or status, and block or unblock people."
      />
      <HydrationBoundary state={state}>
        <UsersView />
      </HydrationBoundary>
    </>
  );
}
