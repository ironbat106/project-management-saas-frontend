"use client";

import { useForm } from "@tanstack/react-form";
import { TextField } from "@/components/form/fields";
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
import { useCreateSprint } from "@/hooks";
import { toIsoDate } from "@/lib/format";
import { sprintSchema } from "@/validation";

interface Props {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SprintFormDialog({ projectId, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <SprintForm projectId={projectId} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SprintForm({
  projectId,
  onDone,
}: {
  projectId: string;
  onDone: () => void;
}) {
  const create = useCreateSprint(projectId);

  const form = useForm({
    defaultValues: { name: "", startDate: "", endDate: "" },
    validators: { onSubmit: sprintSchema, onChange: sprintSchema },
    onSubmit: async ({ value }) => {
      await create.mutateAsync({
        name: value.name,
        startDate: toIsoDate(value.startDate) as string,
        endDate: toIsoDate(value.endDate) as string,
      });
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
        <DialogTitle>New sprint</DialogTitle>
        <DialogDescription>
          A sprint is a fixed period of work. Only one sprint per project can be
          active at a time.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="name">
          {(field) => <TextField field={field} label="Sprint name" autoFocus />}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="startDate">
            {(field) => (
              <TextField field={field} label="Start date" type="date" />
            )}
          </form.Field>
          <form.Field name="endDate">
            {(field) => (
              <TextField field={field} label="End date" type="date" />
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
              {isSubmitting ? "Creating..." : "Create sprint"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
