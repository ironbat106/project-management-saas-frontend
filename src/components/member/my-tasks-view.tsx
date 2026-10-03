"use client";

import { ListChecks } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { FilterSelect } from "@/components/shared/filter-select";
import { SortSelect } from "@/components/shared/sort-select";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusSelect } from "@/components/shared/status-select";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { useListParams, useMyTasks, useUpdateTaskStatus } from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TRANSITIONS,
} from "@/lib/workflow";

export function MyTasksView() {
  const params = useListParams(LIST.myTasks.filters, LIST.myTasks.defaults);
  const query = useMyTasks(params);
  const updateStatus = useUpdateTaskStatus();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description="Tasks assigned to you appear here. Change the filters, or ask an organization owner to assign you a task."
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
                      href={`/member/tasks/${task.id}`}
                      className="font-medium hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {task.project?.name}
                      {task.sprint ? `, ${task.sprint.name}` : ""}
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
              { header: "Due", cell: (task) => formatDate(task.dueDate) },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}
    </div>
  );
}
