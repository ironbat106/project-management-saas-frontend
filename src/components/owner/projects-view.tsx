"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useDeleteProject, useListParams, useProjects } from "@/hooks";
import { LIST } from "@/lib/list-config";
import type { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { ProjectFormDialog } from "./project-form-dialog";

export function ProjectsView({ orgId }: { orgId: string }) {
  const params = useListParams(LIST.projects.filters, LIST.projects.defaults);
  const query = useProjects(orgId, params);
  const remove = useDeleteProject(orgId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search projects" />
        <FilterSelect
          param="status"
          label="Statuses"
          options={["ACTIVE", "COMPLETED", "ARCHIVED"]}
        />
        <SortSelect
          options={[
            { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
            { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
            { label: "Name A to Z", sortBy: "name", sortOrder: "asc" },
            { label: "Ending soonest", sortBy: "endDate", sortOrder: "asc" },
          ]}
        />
        <Button className="ml-auto" onClick={openCreate}>
          <Plus aria-hidden="true" />
          New project
        </Button>
      </div>

      {query.isPending ? (
        <PageSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create a project, or change the search and filters to see other ones."
          action={<Button onClick={openCreate}>Create project</Button>}
        />
      ) : (
        <>
          <div
            className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${query.isFetching ? "opacity-60" : ""}`}
          >
            {query.data.data.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(item) => {
                  setEditing(item);
                  setFormOpen(true);
                }}
                onDelete={setDeleting}
              />
            ))}
          </div>
          <UrlPagination meta={query.data.meta} />
        </>
      )}

      <ProjectFormDialog
        orgId={orgId}
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editing}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this project?"
        description={`${deleting?.name} and its tasks will be removed. This cannot be undone.`}
        confirmLabel="Delete project"
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
