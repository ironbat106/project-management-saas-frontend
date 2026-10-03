"use client";

import { ScrollText } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { useAuditLogs, useListParams } from "@/hooks";
import { formatDateTime, formatLabel, timeAgo } from "@/lib/format";
import { LIST } from "@/lib/list-config";

const ENTITY_TYPES = [
  "ORGANIZATION",
  "ORGANIZATION_MEMBER",
  "TEAM",
  "PROJECT",
  "SPRINT",
  "TASK",
  "SUBTASK",
  "PAYMENT",
];

export function AuditLogsView() {
  const params = useListParams(LIST.auditLogs.filters, LIST.auditLogs.defaults);
  const query = useAuditLogs(params);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          param="entityType"
          label="Entity types"
          options={ENTITY_TYPES}
        />
      </div>

      {query.isPending ? (
        <TableSkeleton rows={8} />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No activity yet"
          description="Actions taken in organizations will be recorded here."
        />
      ) : (
        <>
          <DataTable
            isFetching={query.isFetching}
            rows={query.data.data}
            getKey={(log) => log.id}
            columns={[
              {
                header: "When",
                cell: (log) => (
                  <div>
                    <p>{timeAgo(log.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                ),
              },
              { header: "Action", cell: (log) => formatLabel(log.action) },
              { header: "Type", cell: (log) => formatLabel(log.entityType) },
              {
                header: "Done by",
                cell: (log) => (
                  <div>
                    <p>{log.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.user.email}
                    </p>
                  </div>
                ),
              },
              { header: "Organization", cell: (log) => log.organization.name },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}
    </div>
  );
}
