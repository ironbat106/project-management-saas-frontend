"use client";

import { Plus, Timer } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatusSelect } from "@/components/shared/status-select";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { useSprints, useUpdateSprintStatus } from "@/hooks";
import { formatDate } from "@/lib/format";
import { SPRINT_TRANSITIONS } from "@/lib/workflow";
import { SprintFormDialog } from "./sprint-form-dialog";

export function ProjectSprints({ projectId }: { projectId: string }) {
  const query = useSprints(projectId);
  const updateStatus = useUpdateSprintStatus(projectId);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>
          <Plus aria-hidden="true" />
          New sprint
        </Button>
      </div>

      {query.isPending ? (
        <TableSkeleton rows={3} />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="No sprints yet"
          description="Create a sprint to group tasks into a fixed period of work."
          action={
            <Button onClick={() => setFormOpen(true)}>Create sprint</Button>
          }
        />
      ) : (
        <DataTable
          rows={query.data.data}
          getKey={(sprint) => sprint.id}
          columns={[
            {
              header: "Sprint",
              cell: (sprint) => (
                <span className="font-medium">{sprint.name}</span>
              ),
            },
            {
              header: "Dates",
              cell: (sprint) =>
                `${formatDate(sprint.startDate)} to ${formatDate(sprint.endDate)}`,
            },
            {
              header: "Tasks",
              className: "tabular-nums",
              cell: (sprint) => sprint._count?.tasks ?? 0,
            },
            {
              header: "Status",
              cell: (sprint) => (
                <StatusSelect
                  label={`Status of ${sprint.name}`}
                  current={sprint.status}
                  next={SPRINT_TRANSITIONS[sprint.status]}
                  disabled={updateStatus.isPending}
                  onChange={(status) =>
                    updateStatus.mutate({ id: sprint.id, status })
                  }
                />
              ),
            },
          ]}
        />
      )}

      <SprintFormDialog
        projectId={projectId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
