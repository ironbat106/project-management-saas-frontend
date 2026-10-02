"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/form/fields";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useChangePassword, useUpdateProfile } from "@/hooks";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";
import { changePasswordSchema, profileSchema } from "@/validation";

export function ProfileForms({ user }: { user: User }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <AccountCard user={user} />
        <NameForm user={user} />
      </div>
      {user.authProvider === "CREDENTIAL" ? (
        <PasswordForm />
      ) : (
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              You sign in with Google, so there is no password to change here.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

function AccountCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>These details cannot be edited here.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y text-sm">
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <StatusBadge value={user.role} />
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function NameForm({ user }: { user: User }) {
  const router = useRouter();
  const update = useUpdateProfile();

  const form = useForm({
    defaultValues: { name: user.name },
    validators: { onSubmit: profileSchema, onChange: profileSchema },
    onSubmit: async ({ value }) => {
      await update.mutateAsync(value);
      router.refresh();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Change the name shown to your teammates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <TextField
                  field={field}
                  label="Full name"
                  autoComplete="name"
                />
              )}
            </form.Field>
          </FieldGroup>
          <form.Subscribe
            selector={(state) =>
              [state.isSubmitting, state.isDefaultValue] as const
            }
          >
            {([isSubmitting, isDefaultValue]) => (
              <Button type="submit" disabled={isSubmitting || isDefaultValue}>
                {isSubmitting ? "Saving..." : "Save profile"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm() {
  const change = useChangePassword();

  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validators: {
      onSubmit: changePasswordSchema,
      onChange: changePasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await change.mutateAsync({
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      });
      formApi.reset();
    },
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Use at least 8 characters with upper and lower case letters, a number
          and a special character.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field name="oldPassword">
              {(field) => (
                <TextField
                  field={field}
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
            </form.Field>
            <form.Field name="newPassword">
              {(field) => (
                <TextField
                  field={field}
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                />
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <TextField
                  field={field}
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                />
              )}
            </form.Field>
          </FieldGroup>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
