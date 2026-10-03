"use client";

import { CircleCheck, ListChecks, Loader, Siren } from "lucide-react";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "@/components/shared/chart-card";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatCard } from "@/components/shared/stat-card";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { useMyOverview } from "@/hooks";
import { formatLabel } from "@/lib/format";

export function ProgressView() {
  const query = useMyOverview();

  if (query.isPending) return <PageSkeleton withStats />;
  if (query.isError) return <ErrorPanel onRetry={() => query.refetch()} />;

  const { byStatus, byPriority } = query.data.data;
  const total = byStatus.reduce((sum, item) => sum + item.value, 0);
  const count = (status: string) =>
    byStatus.find((item) => item.status === status)?.value ?? 0;
  const urgent =
    byPriority.find((item) => item.priority === "URGENT")?.value ?? 0;
  const donePercent =
    total === 0 ? 0 : Math.round((count("DONE") / total) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned to me" value={total} icon={ListChecks} />
        <StatCard
          label="In progress"
          value={count("IN_PROGRESS")}
          icon={Loader}
        />
        <StatCard
          label="Done"
          value={count("DONE")}
          icon={CircleCheck}
          hint={total === 0 ? undefined : `${donePercent}% of my tasks`}
        />
        <StatCard label="Urgent" value={urgent} icon={Siren} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tasks by status" description="Where my work stands">
          <SimpleBarChart
            data={byStatus.map((item) => ({
              label: formatLabel(item.status),
              value: item.value,
            }))}
          />
        </ChartCard>
        <ChartCard
          title="Tasks by priority"
          description="How urgent my work is"
        >
          <DonutChart
            data={byPriority.map((item) => ({
              label: formatLabel(item.priority),
              value: item.value,
            }))}
          />
        </ChartCard>
      </div>
    </div>
  );
}
