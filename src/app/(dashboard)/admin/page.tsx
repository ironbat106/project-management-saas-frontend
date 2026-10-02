import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { adminApi } from "@/api";
import { AdminOverview } from "@/components/admin/admin-overview";
import { PageHeader } from "@/components/shared/page-header";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Admin overview" };

export default async function AdminPage() {
  const state = await prefetch([
    {
      queryKey: queryKeys.admin.overview,
      queryFn: () => adminApi.overview(serverRequest),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="A live summary of every user, organization, project and task on the platform."
      />
      <HydrationBoundary state={state}>
        <AdminOverview />
      </HydrationBoundary>
    </>
  );
}
