"use client";

import { useForm } from "@tanstack/react-form";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  useAssignTask,
  useCreateTask,
  useMembers,
  useSprints,
  useUpdateTask,
} from "@/hooks";
import { formatLabel, toDateInput, toIsoDate } from "@/lib/format";
import { TASK_PRIORITIES } from "@/lib/workflow";
import type { Task } from "@/types";
import { taskSchema } from "@/validation";

interface Props {
  orgId: string;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskFormDialog({
  orgId,
  projectId,
  open,
  onOpenChange,
  task,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <TaskForm
          key={task?.id ?? "new"}
          orgId={orgId}
          projectId={projectId}
          task={task}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({
  orgId,
  projectId,
  task,
  onDone,
}: {
  orgId: string;
  projectId: string;
  task?: Task | null;
  onDone: () => void;
}) {
  const isEdit = Boolean(task);
  const create = useCreateTask(projectId);
  const edit = useUpdateTask();
  const assign = useAssignTask();
  const sprints = useSprints(projectId);
  const members = useMembers(orgId, { limit: 100 });

  const form = useForm({
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      sprintId: task?.sprintId ?? "",
      assigneeId: task?.assigneeId ?? "",
      dueDate: toDateInput(task?.dueDate),
    },
    validators: { onSubmit: taskSchema, onChange: taskSchema },
    onSubmit: async ({ value }) => {
      const body = {
        title: value.title,
        description: value.description || undefined,
        priority: value.priority,
        sprintId: value.sprintId || undefined,
        dueDate: toIsoDate(value.dueDate),
      };

      if (task) {
        await edit.mutateAsync({ id: task.id, body });
        if (value.assigneeId && value.assigneeId !== task.assigneeId) {
          await assign.mutateAsync({
            id: task.id,
            assigneeId: value.assigneeId,
          });
        }
      } else {
        await create.mutateAsync({
          ...body,
          assigneeId: value.assigneeId || undefined,
        });
      }
      onDone();
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details of this task."
            : "Add a task to this project. You can assign it now or later."}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="title">
          {(field) => <TextField field={field} label="Title" autoFocus />}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextAreaField
              field={field}
              label="Description"
              description="Optional"
              rows={3}
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="priority">
            {(field) => (
              <SelectField
                field={field}
                label="Priority"
                options={TASK_PRIORITIES.map((priority) => ({
                  value: priority,
                  label: formatLabel(priority),
                }))}
              />
            )}
          </form.Field>
          <form.Field name="dueDate">
            {(field) => (
              <TextField field={field} label="Due date" type="date" />
            )}
          </form.Field>
          <form.Field name="sprintId">
            {(field) => (
              <SelectField
                field={field}
                label="Sprint"
                placeholder="No sprint"
                options={(sprints.data?.data ?? []).map((sprint) => ({
                  value: sprint.id,
                  label: sprint.name,
                }))}
              />
            )}
          </form.Field>
          <form.Field name="assigneeId">
            {(field) => (
              <SelectField
                field={field}
                label="Assignee"
                placeholder="Unassigned"
                options={(members.data?.data ?? []).map((member) => ({
                  value: member.userId,
                  label: member.user.name,
                }))}
              />
            )}
          </form.Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create task"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
