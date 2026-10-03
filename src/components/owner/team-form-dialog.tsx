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
import { useCreateTeam } from "@/hooks";
import { teamSchema } from "@/validation";

interface Props {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamFormDialog({ orgId, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <TeamForm orgId={orgId} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TeamForm({ orgId, onDone }: { orgId: string; onDone: () => void }) {
  const create = useCreateTeam(orgId);

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: teamSchema, onChange: teamSchema },
    onSubmit: async ({ value }) => {
      await create.mutateAsync(value);
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
        <DialogTitle>New team</DialogTitle>
        <DialogDescription>
          Teams group members. A project can be linked to one team.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="name">
          {(field) => <TextField field={field} label="Team name" autoFocus />}
        </form.Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create team"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
