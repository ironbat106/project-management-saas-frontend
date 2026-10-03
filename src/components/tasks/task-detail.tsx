"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CalendarDays, Layers, User } from "lucide-react";
import Link from "next/link";
import { TextAreaField, TextField } from "@/components/form/fields";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusSelect } from "@/components/shared/status-select";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import {
  useAddComment,
  useCreateSubtask,
  useTask,
  useToggleSubtask,
  useUpdateTaskStatus,
} from "@/hooks";
import { formatDate, formatDateTime, timeAgo } from "@/lib/format";
import { TASK_TRANSITIONS } from "@/lib/workflow";
import type { Role } from "@/types";
import { commentSchema, subtaskSchema } from "@/validation";

interface Props {
  taskId: string;
  role: Role;
  userId: string;
}

export function TaskDetail({ taskId, role, userId }: Props) {
  const query = useTask(taskId);
  const updateStatus = useUpdateTaskStatus();

  if (query.isPending) return <PageSkeleton />;
  if (query.isError) return <ErrorPanel onRetry={() => query.refetch()} />;

  const task = query.data.data;
  const canChangeStatus = role === "OWNER" || task.assigneeId === userId;
  const backHref =
    role === "OWNER" ? `/owner/projects/${task.projectId}` : "/member";
  const backLabel = role === "OWNER" ? "Back to project" : "Back to my tasks";

  const done = task.subtasks.filter((subtask) => subtask.isCompleted).length;

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={task.priority} />
            <span className="text-sm text-muted-foreground">
              Created by {task.createdBy.name} on {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {canChangeStatus ? (
          <StatusSelect
            label="Task status"
            current={task.status}
            next={TASK_TRANSITIONS[task.status]}
            onChange={(status) => updateStatus.mutate({ id: task.id, status })}
          />
        ) : (
          <StatusBadge value={task.status} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {task.description || "This task has no description."}
              </p>
            </CardContent>
          </Card>

          <Subtasks taskId={task.id} subtasks={task.subtasks} done={done} />
          <Comments taskId={task.id} comments={task.comments} />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-muted-foreground">Assignee</dt>
                  <dd className="font-medium">
                    {task.assignee?.name ?? "Unassigned"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-muted-foreground">Sprint</dt>
                  <dd className="font-medium">
                    {task.sprint?.name ?? "Not in a sprint"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-muted-foreground">Due date</dt>
                  <dd className="font-medium">{formatDate(task.dueDate)}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Subtasks({
  taskId,
  subtasks,
  done,
}: {
  taskId: string;
  subtasks: { id: string; title: string; isCompleted: boolean }[];
  done: number;
}) {
  const toggle = useToggleSubtask(taskId);
  const create = useCreateSubtask(taskId);

  const form = useForm({
    defaultValues: { title: "" },
    validators: { onSubmit: subtaskSchema },
    onSubmit: async ({ value, formApi }) => {
      await create.mutateAsync(value.title);
      formApi.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtasks</CardTitle>
        <CardDescription>
          {subtasks.length === 0
            ? "Break this task into smaller steps."
            : `${done} of ${subtasks.length} done`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subtasks.length > 0 ? (
          <ul className="space-y-1">
            {subtasks.map((subtask) => (
              <li key={subtask.id}>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: the checkbox sits inside this label */}
                <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted">
                  <Checkbox
                    checked={subtask.isCompleted}
                    onCheckedChange={() => toggle.mutate(subtask.id)}
                  />
                  <span
                    className={
                      subtask.isCompleted
                        ? "text-sm text-muted-foreground line-through"
                        : "text-sm"
                    }
                  >
                    {subtask.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="flex items-start gap-2"
        >
          <div className="flex-1">
            <form.Field name="title">
              {(field) => (
                <TextField
                  field={field}
                  label="New subtask"
                  placeholder="Write a step and press Add"
                />
              )}
            </form.Field>
          </div>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                variant="outline"
                className="mt-6"
                disabled={isSubmitting}
              >
                Add
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

function Comments({
  taskId,
  comments,
}: {
  taskId: string;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string };
  }[];
}) {
  const add = useAddComment(taskId);

  const form = useForm({
    defaultValues: { content: "" },
    validators: { onSubmit: commentSchema },
    onSubmit: async ({ value, formApi }) => {
      await add.mutateAsync(value.content);
      formApi.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>
          {comments.length === 0
            ? "No comments yet. Start the conversation."
            : `${comments.length} comments`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length > 0 ? (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border bg-muted/40 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium">{comment.author.name}</p>
                  <time
                    dateTime={comment.createdAt}
                    title={formatDateTime(comment.createdAt)}
                    className="text-xs text-muted-foreground"
                  >
                    {timeAgo(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-3"
        >
          <FieldGroup>
            <form.Field name="content">
              {(field) => (
                <TextAreaField
                  field={field}
                  label="Add a comment"
                  rows={3}
                  placeholder="Share an update or ask a question"
                />
              )}
            </form.Field>
          </FieldGroup>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post comment"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
