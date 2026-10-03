"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useState } from "react";
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
import { useCreateProject, useTeams, useUpdateProject } from "@/hooks";
import { toDateInput, toIsoDate } from "@/lib/format";
import { useProjectDraft } from "@/store/project-draft.store";
import type { Project } from "@/types";
import {
  projectBasicsSchema,
  projectScheduleSchema,
  projectSchema,
} from "@/validation";

interface Props {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectFormDialog({
  orgId,
  open,
  onOpenChange,
  project,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ProjectWizard
          key={project?.id ?? "new"}
          orgId={orgId}
          project={project}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

const STEPS = ["Basics", "Schedule and team"];

function ProjectWizard({
  orgId,
  project,
  onDone,
}: {
  orgId: string;
  project?: Project | null;
  onDone: () => void;
}) {
  const isEdit = Boolean(project);
  const [initialDraft] = useState(() => useProjectDraft.getState());
  const setDraft = useProjectDraft((state) => state.setDraft);
  const clearDraft = useProjectDraft((state) => state.clearDraft);
  const [step, setStep] = useState(isEdit ? 0 : initialDraft.step);

  const create = useCreateProject(orgId);
  const update = useUpdateProject(orgId);
  const teams = useTeams(orgId, { limit: 100 });

  const form = useForm({
    defaultValues: project
      ? {
          name: project.name,
          description: project.description ?? "",
          teamId: project.teamId ?? "",
          startDate: toDateInput(project.startDate),
          endDate: toDateInput(project.endDate),
        }
      : initialDraft.values,
    validators: { onSubmit: projectSchema },
    onSubmit: async ({ value }) => {
      const body = {
        name: value.name,
        description: value.description || undefined,
        teamId: value.teamId || undefined,
        startDate: toIsoDate(value.startDate),
        endDate: toIsoDate(value.endDate),
      };

      if (project) {
        await update.mutateAsync({ id: project.id, body });
      } else {
        await create.mutateAsync(body);
        clearDraft();
      }
      onDone();
    },
  });

  const values = useStore(form.store, (state) => state.values);
  useEffect(() => {
    if (!isEdit) setDraft({ step, values });
  }, [isEdit, step, values, setDraft]);


  async function next() {
    const names = ["name", "description"] as const;

    for (const name of names) {
      form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }));
    }
    await Promise.all(names.map((name) => form.validateField(name, "change")));

    if (names.every((name) => form.getFieldMeta(name)?.isValid)) setStep(1);
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 0) next();
        else form.handleSubmit();
      }}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
        <DialogDescription>
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
          {isEdit ? "" : ". Your draft is saved until you create the project."}
        </DialogDescription>
      </DialogHeader>

      <ol className="flex gap-2" aria-label="Progress">
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={`h-1.5 flex-1 rounded-sm ${index <= step ? "bg-primary" : "bg-muted"}`}
          >
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <FieldGroup>
          <form.Field
            name="name"
            validators={{
              onChange: projectBasicsSchema.shape.name,
              onBlur: projectBasicsSchema.shape.name,
            }}
          >
            {(field) => (
              <TextField field={field} label="Project name" autoFocus />
            )}
          </form.Field>
          <form.Field
            name="description"
            validators={{ onChange: projectBasicsSchema.shape.description }}
          >
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
      ) : (
        <FieldGroup>
          <form.Field name="teamId">
            {(field) => (
              <SelectField
                field={field}
                label="Team"
                description="Optional. Link this project to one team."
                placeholder="No team"
                options={(teams.data?.data ?? []).map((team) => ({
                  value: team.id,
                  label: team.name,
                }))}
              />
            )}
          </form.Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="startDate">
              {(field) => (
                <TextField field={field} label="Start date" type="date" />
              )}
            </form.Field>
            <form.Field
              name="endDate"
              validators={{
                onChangeListenTo: ["startDate"],
                onChange: ({ value, fieldApi }) => {
                  const result = projectScheduleSchema.safeParse({
                    teamId: "",
                    startDate: fieldApi.form.getFieldValue("startDate"),
                    endDate: value,
                  });
                  return result.success
                    ? undefined
                    : { message: result.error.issues[0]?.message };
                },
              }}
            >
              {(field) => (
                <TextField field={field} label="End date" type="date" />
              )}
            </form.Field>
          </div>
        </FieldGroup>
      )}

      <DialogFooter>
        {step === 0 ? (
          <>
            <Button type="button" variant="outline" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : isEdit
                      ? "Save changes"
                      : "Create project"}
                </Button>
              )}
            </form.Subscribe>
          </>
        )}
      </DialogFooter>
    </form>
  );
}
