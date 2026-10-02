"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerAction } from "@/actions/auth.actions";
import { TextField } from "@/components/form/fields";
import { FormError } from "@/components/form/form-error";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { registerSchema } from "@/validation";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    validators: { onSubmit: registerSchema, onChange: registerSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const result = await registerAction(value);

      if (!result.ok) {
        setFormError(result.message ?? "Could not create your account.");
        return;
      }

      router.replace(result.redirectTo ?? "/");
      router.refresh();
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
      <FormError message={formError} />

      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <TextField field={field} label="Full name" autoComplete="name" />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <TextField
              field={field}
              label="Email"
              type="email"
              autoComplete="email"
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <TextField
              field={field}
              label="Password"
              type="password"
              autoComplete="new-password"
              description="At least 8 characters with upper and lower case letters, a number and a special character."
            />
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <TextField
              field={field}
              label="Confirm password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        )}
      </form.Subscribe>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
