"use client";

import {
  Building2,
  CreditCard,
  FolderKanban,
  ListChecks,
  Users,
} from "lucide-react";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "@/components/shared/chart-card";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatCard } from "@/components/shared/stat-card";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { useAdminOverview } from "@/hooks";

export function AdminOverview() {
  const query = useAdminOverview();

  if (query.isPending) return <PageSkeleton withStats />;
  if (query.isError) return <ErrorPanel onRetry={() => query.refetch()} />;

  const { stats, usersByRole, orgsByPlan } = query.data.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Users" value={stats.totalUsers} icon={Users} />
        <StatCard
          label="Organizations"
          value={stats.totalOrganizations}
          icon={Building2}
        />
        <StatCard
          label="Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <StatCard label="Tasks" value={stats.totalTasks} icon={ListChecks} />
        <StatCard
          label="Paid organizations"
          value={stats.paidOrganizations}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Users by role" description="All active accounts">
          <SimpleBarChart data={usersByRole} />
        </ChartCard>
        <ChartCard
          title="Organizations by plan"
          description="Free, Pro and Business workspaces"
        >
          <DonutChart data={orgsByPlan} />
        </ChartCard>
      </div>
    </div>
  );
}
