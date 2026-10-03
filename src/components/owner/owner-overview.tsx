"use client";

import { FolderKanban, ListChecks, Users, UsersRound } from "lucide-react";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "@/components/shared/chart-card";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatCard } from "@/components/shared/stat-card";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { useOrgOverview } from "@/hooks";
import { formatLabel } from "@/lib/format";

export function OwnerOverview({ orgId }: { orgId: string }) {
  const query = useOrgOverview(orgId);

  if (query.isPending) return <PageSkeleton withStats />;
  if (query.isError) return <ErrorPanel onRetry={() => query.refetch()} />;

  const { stats, projectsByStatus } = query.data.data;
  const taskChart = stats.tasksByStatus.map((item) => ({
    label: formatLabel(item.status),
    value: item.count,
  }));
  const totalTasks = stats.tasksByStatus.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={stats.totalMembers} icon={Users} />
        <StatCard label="Teams" value={stats.totalTeams} icon={UsersRound} />
        <StatCard
          label="Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <StatCard label="Tasks" value={totalTasks} icon={ListChecks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Tasks by status"
          description="All tasks in this organization"
        >
          <SimpleBarChart data={taskChart} />
        </ChartCard>
        <ChartCard
          title="Projects by status"
          description="Active, completed and archived"
        >
          <DonutChart data={projectsByStatus} />
        </ChartCard>
      </div>
    </div>
  );
}
