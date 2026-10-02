"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useAdminUsers, useListParams, useSetUserStatus } from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import type { User } from "@/types";

export function UsersView() {
  const params = useListParams(LIST.users.filters, LIST.users.defaults);
  const query = useAdminUsers(params);
  const setStatus = useSetUserStatus();
  const [target, setTarget] = useState<User | null>(null);

  const nextStatus = target?.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search by name or email" />
        <FilterSelect
          param="role"
          label="Roles"
          options={["ADMIN", "OWNER", "MEMBER"]}
        />
        <FilterSelect
          param="status"
          label="Statuses"
          options={["ACTIVE", "BLOCKED"]}
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
          icon={Users}
          title="No users found"
          description="Try a different search or clear the filters."
        />
      ) : (
        <>
          <DataTable
            isFetching={query.isFetching}
            rows={query.data.data}
            getKey={(user) => user.id}
            columns={[
              {
                header: "User",
                cell: (user) => (
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                ),
              },
              {
                header: "Role",
                cell: (user) => <StatusBadge value={user.role} />,
              },
              {
                header: "Status",
                cell: (user) => <StatusBadge value={user.status} />,
              },
              { header: "Joined", cell: (user) => formatDate(user.createdAt) },
              {
                header: "Action",
                className: "text-right",
                cell: (user) =>
                  user.role === "ADMIN" ? (
                    <span className="text-xs text-muted-foreground">
                      Protected
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTarget(user)}
                    >
                      {user.status === "BLOCKED" ? "Unblock" : "Block"}
                    </Button>
                  ),
              },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={
          nextStatus === "BLOCKED" ? "Block this user?" : "Unblock this user?"
        }
        description={
          nextStatus === "BLOCKED"
            ? `${target?.name} will no longer be able to log in or use the API.`
            : `${target?.name} will be able to log in again.`
        }
        confirmLabel={nextStatus === "BLOCKED" ? "Block user" : "Unblock user"}
        destructive={nextStatus === "BLOCKED"}
        isPending={setStatus.isPending}
        onConfirm={() => {
          if (!target) return;
          setStatus.mutate(
            { id: target.id, status: nextStatus },
            { onSettled: () => setTarget(null) },
          );
        }}
      />
    </div>
  );
}
