"use client";

import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusSelect } from "@/components/shared/status-select";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import {
  useDeleteTask,
  useListParams,
  useProjectTasks,
  useUpdateTaskStatus,
} from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TRANSITIONS,
} from "@/lib/workflow";
import type { Task } from "@/types";
import { TaskFormDialog } from "./task-form-dialog";

interface Props {
  orgId: string;
  projectId: string;
  canCreate: boolean;
}

export function ProjectTasks({ orgId, projectId, canCreate }: Props) {
  const params = useListParams(
    LIST.projectTasks.filters,
    LIST.projectTasks.defaults,
  );
  const query = useProjectTasks(projectId, params);
  const updateStatus = useUpdateTaskStatus();
  const remove = useDeleteTask();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search tasks" />
        <FilterSelect param="status" label="Statuses" options={TASK_STATUSES} />
        <FilterSelect
          param="priority"
          label="Priorities"
          options={[...TASK_PRIORITIES]}
        />
        <SortSelect
          options={[
            { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
            { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
            { label: "Due soonest", sortBy: "dueDate", sortOrder: "asc" },
            { label: "Title A to Z", sortBy: "title", sortOrder: "asc" },
          ]}
        />
        {canCreate ? (
          <Button className="ml-auto" onClick={openCreate}>
            <Plus aria-hidden="true" />
            New task
          </Button>
        ) : null}
      </div>

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description="Add a task to this project, or change the search and filters."
          action={
            canCreate ? (
              <Button onClick={openCreate}>Create task</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <DataTable
            isFetching={query.isFetching}
            rows={query.data.data}
            getKey={(task) => task.id}
            columns={[
              {
                header: "Task",
                cell: (task) => (
                  <div className="min-w-48">
                    <Link
                      href={`/owner/tasks/${task.id}`}
                      className="font-medium hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {task._count?.subtasks ?? 0} subtasks,{" "}
                      {task._count?.comments ?? 0} comments
                    </p>
                  </div>
                ),
              },
              {
                header: "Status",
                cell: (task) => (
                  <StatusSelect
                    label={`Status of ${task.title}`}
                    current={task.status}
                    next={TASK_TRANSITIONS[task.status]}
                    onChange={(status) =>
                      updateStatus.mutate({ id: task.id, status })
                    }
                  />
                ),
              },
              {
                header: "Priority",
                cell: (task) => <StatusBadge value={task.priority} />,
              },
              {
                header: "Assignee",
                cell: (task) =>
                  task.assignee?.name ?? (
                    <span className="text-muted-foreground">Unassigned</span>
                  ),
              },
              { header: "Sprint", cell: (task) => task.sprint?.name ?? "None" },
              { header: "Due", cell: (task) => formatDate(task.dueDate) },
              {
                header: "Actions",
                className: "text-right",
                cell: (task) => (
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditing(task);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil aria-hidden="true" />
                      <span className="sr-only">Edit {task.title}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleting(task)}
                    >
                      <Trash2 aria-hidden="true" />
                      <span className="sr-only">Delete {task.title}</span>
                    </Button>
                  </div>
                ),
              },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}

      <TaskFormDialog
        orgId={orgId}
        projectId={projectId}
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this task?"
        description={`"${deleting?.title}" and its subtasks and comments will be removed.`}
        confirmLabel="Delete task"
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
