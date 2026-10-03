"use client";

import { ArrowLeft, CalendarDays, UsersRound } from "lucide-react";
import Link from "next/link";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatusSelect } from "@/components/shared/status-select";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject, useUpdateProjectStatus } from "@/hooks";
import { formatDate } from "@/lib/format";
import { PROJECT_TRANSITIONS } from "@/lib/workflow";
import { ProjectSprints } from "./project-sprints";
import { ProjectTasks } from "./project-tasks";

interface Props {
  orgId: string;
  projectId: string;
}

export function ProjectDetail({ orgId, projectId }: Props) {
  const query = useProject(projectId);
  const updateStatus = useUpdateProjectStatus(orgId);

  if (query.isPending) return <PageSkeleton />;
  if (query.isError) return <ErrorPanel onRetry={() => query.refetch()} />;

  const project = query.data.data;

  return (
    <div className="space-y-6">
      <Link
        href="/owner/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {project.description || "No description yet."}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(project.startDate)} to {formatDate(project.endDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersRound className="size-4" aria-hidden="true" />
              {project.team ? project.team.name : "No team linked"}
            </span>
          </div>
        </div>

        <StatusSelect
          label="Project status"
          current={project.status}
          next={PROJECT_TRANSITIONS[project.status]}
          disabled={updateStatus.isPending}
          onChange={(status) => updateStatus.mutate({ id: project.id, status })}
        />
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">
            Tasks ({project._count?.tasks ?? 0})
          </TabsTrigger>
          <TabsTrigger value="sprints">
            Sprints ({project._count?.sprints ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="pt-4">
          <ProjectTasks
            orgId={orgId}
            projectId={projectId}
            canCreate={project.status !== "ARCHIVED"}
          />
        </TabsContent>
        <TabsContent value="sprints" className="pt-4">
          <ProjectSprints projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
