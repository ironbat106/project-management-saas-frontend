"use client";

import { Building2 } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { useAdminOrganizations, useListParams } from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";

export function AdminOrganizationsView() {
  const params = useListParams(
    LIST.adminOrganizations.filters,
    LIST.adminOrganizations.defaults,
  );
  const query = useAdminOrganizations(params);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search by organization name" />
        <FilterSelect
          param="subscriptionPlan"
          label="Plans"
          options={["FREE", "PRO", "BUSINESS"]}
        />
        <SortSelect
          options={[
            { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
            { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
            { label: "Name A to Z", sortBy: "name", sortOrder: "asc" },
          ]}
        />
      </div>

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="Try a different search or clear the filters."
        />
      ) : (
        <>
          <DataTable
            isFetching={query.isFetching}
            rows={query.data.data}
            getKey={(organization) => organization.id}
            columns={[
              {
                header: "Organization",
                cell: (organization) => (
                  <div>
                    <p className="font-medium">{organization.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {organization.slug}
                    </p>
                  </div>
                ),
              },
              {
                header: "Owner",
                cell: (organization) => (
                  <div>
                    <p>{organization.owner?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {organization.owner?.email}
                    </p>
                  </div>
                ),
              },
              {
                header: "Plan",
                cell: (organization) => (
                  <StatusBadge value={organization.subscriptionPlan} />
                ),
              },
              {
                header: "Members",
                className: "text-right tabular-nums",
                cell: (organization) => organization._count?.members ?? 0,
              },
              {
                header: "Projects",
                className: "text-right tabular-nums",
                cell: (organization) => organization._count?.projects ?? 0,
              },
              {
                header: "Created",
                cell: (organization) => formatDate(organization.createdAt),
              },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}
    </div>
  );
}
