"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { useInviteMember } from "@/hooks";
import { inviteMemberSchema } from "@/validation";

interface Props {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ orgId, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <InviteForm orgId={orgId} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function InviteForm({ orgId, onDone }: { orgId: string; onDone: () => void }) {
  const invite = useInviteMember(orgId);
  // The backend returns a temporary password once, for brand new accounts.
  const [created, setCreated] = useState<{
    email: string;
    password: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm({
    defaultValues: { name: "", email: "" },
    validators: { onSubmit: inviteMemberSchema, onChange: inviteMemberSchema },
    onSubmit: async ({ value }) => {
      const response = await invite.mutateAsync(value);
      setCreated({
        email: value.email,
        password: response.data.temporaryPassword,
      });
    },
  });

  if (created) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Member added</DialogTitle>
          <DialogDescription>
            {created.password
              ? `A new account was created for ${created.email}. Share this temporary password with them. It is shown only once.`
              : `${created.email} already had an account and now belongs to this organization.`}
          </DialogDescription>
        </DialogHeader>

        {created.password ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted px-3 py-2.5">
            <code className="text-sm font-medium">{created.password}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(created.password ?? "");
                  setCopied(true);
                } catch {
                  toast.error("Could not copy. Select the text and copy it.");
                }
              }}
            >
              {copied ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : null}

        <DialogFooter>
          <Button onClick={onDone}>Done</Button>
        </DialogFooter>
      </>
    );
  }

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
        <DialogTitle>Add a member</DialogTitle>
        <DialogDescription>
          If the email has no account yet, one is created with a temporary
          password.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="name">
          {(field) => <TextField field={field} label="Full name" autoFocus />}
        </form.Field>
        <form.Field name="email">
          {(field) => <TextField field={field} label="Email" type="email" />}
        </form.Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add member"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}