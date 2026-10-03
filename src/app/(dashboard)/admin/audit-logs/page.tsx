import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { adminApi } from "@/api";
import { AuditLogsView } from "@/components/admin/audit-logs-view";
import { PageHeader } from "@/components/shared/page-header";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Audit log" };

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.auditLogs.filters,
    LIST.auditLogs.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.admin.auditLogs(params),
      queryFn: () => adminApi.auditLogs(serverRequest, params),
    },
  ]);

  return (
    <>
      <PageHeader
        title="Audit log"
        description="A record of what people did across all organizations, newest first."
      />
      <HydrationBoundary state={state}>
        <AuditLogsView />
      </HydrationBoundary>
    </>
  );
}
