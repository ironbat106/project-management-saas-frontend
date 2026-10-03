"use client";

import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import {
  useDeleteOrganization,
  useListParams,
  useOrganizations,
} from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import type { Organization } from "@/types";
import { OrganizationFormDialog } from "./organization-form-dialog";

export function OwnerOrganizationsView() {
  const params = useListParams(
    LIST.ownerOrganizations.filters,
    LIST.ownerOrganizations.defaults,
  );
  const query = useOrganizations(params);
  const remove = useDeleteOrganization();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState<Organization | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(organization: Organization) {
    setEditing(organization);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search organizations" />
        <SortSelect
          options={[
            { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
            { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
            { label: "Name A to Z", sortBy: "name", sortOrder: "asc" },
          ]}
        />
        <Button className="ml-auto" onClick={openCreate}>
          <Plus aria-hidden="true" />
          New organization
        </Button>
      </div>

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create an organization to start adding teams, projects and tasks."
          action={<Button onClick={openCreate}>Create organization</Button>}
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
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {organization.description ?? organization.slug}
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
              {
                header: "Actions",
                className: "text-right",
                cell: (organization) => (
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(organization)}
                    >
                      <Pencil aria-hidden="true" />
                      <span className="sr-only">Edit {organization.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleting(organization)}
                    >
                      <Trash2 aria-hidden="true" />
                      <span className="sr-only">
                        Delete {organization.name}
                      </span>
                    </Button>
                  </div>
                ),
              },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}

      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={editing}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this organization?"
        description={`${deleting?.name} and its projects will be removed. This cannot be undone.`}
        confirmLabel="Delete organization"
        destructive
        isPending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;
          remove.mutate(deleting.id, { onSettled: () => setDeleting(null) });
        }}
      />
    </div>
  );
}
