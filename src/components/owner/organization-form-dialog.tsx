"use client";

import { useForm } from "@tanstack/react-form";
import { TextAreaField, TextField } from "@/components/form/fields";
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
import { useCreateOrganization, useUpdateOrganization } from "@/hooks";
import type { Organization } from "@/types";
import { organizationSchema } from "@/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When an organization is passed, the form edits it. Otherwise it creates one.
  organization?: Organization | null;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* The key resets the form each time it opens for a different item. */}
        <OrganizationForm
          key={organization?.id ?? "new"}
          organization={organization}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function OrganizationForm({
  organization,
  onDone,
}: {
  organization?: Organization | null;
  onDone: () => void;
}) {
  const create = useCreateOrganization();
  const update = useUpdateOrganization();
  const isEdit = Boolean(organization);

  const form = useForm({
    defaultValues: {
      name: organization?.name ?? "",
      description: organization?.description ?? "",
    },
    validators: { onSubmit: organizationSchema, onChange: organizationSchema },
    onSubmit: async ({ value }) => {
      const body = {
        name: value.name,
        description: value.description || undefined,
      };

      if (organization) {
        await update.mutateAsync({ id: organization.id, body });
      } else {
        await create.mutateAsync(body);
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
        <DialogTitle>
          {isEdit ? "Edit organization" : "New organization"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Change the name or description of this workspace."
            : "An organization holds your teams, projects and tasks."}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="name">
          {(field) => <TextField field={field} label="Name" autoFocus />}
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
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
