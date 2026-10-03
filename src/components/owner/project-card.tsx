import { CalendarDays, ListChecks, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Project } from "@/types";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: Props) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="min-w-0">
            <Link
              href={`/owner/projects/${project.id}`}
              className="line-clamp-1 hover:underline"
            >
              {project.name}
            </Link>
          </CardTitle>
          <StatusBadge value={project.status} />
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {project.description || "No description yet."}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            <dt className="sr-only">Dates</dt>
            <dd>
              {formatDate(project.startDate)} to {formatDate(project.endDate)}
            </dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ListChecks className="size-4" aria-hidden="true" />
            <dt className="sr-only">Work</dt>
            <dd>
              {project._count?.tasks ?? 0} tasks, {project._count?.sprints ?? 0}{" "}
              sprints
              {project.team ? `, team ${project.team.name}` : ""}
            </dd>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/owner/projects/${project.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Open project
          </Link>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(project)}
            >
              <Pencil aria-hidden="true" />
              <span className="sr-only">Edit {project.name}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(project)}
            >
              <Trash2 aria-hidden="true" />
              <span className="sr-only">Delete {project.name}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
