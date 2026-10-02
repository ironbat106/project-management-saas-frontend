"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { TextAreaField, TextField } from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { contactSchema } from "@/validation";

// There is no mail server behind this form. When the form is valid, it opens
// the person's own email app with the message already written.
export function ContactForm() {
  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
    validators: { onSubmit: contactSchema, onChange: contactSchema },
    onSubmit: ({ value, formApi }) => {
      const subject = encodeURIComponent(
        `${SITE_NAME} message from ${value.name}`,
      );
      const body = encodeURIComponent(
        `${value.message}\n\nFrom: ${value.name} (${value.email})`,
      );

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      toast.success(
        "Your email app should open with the message ready to send.",
      );
      formApi.reset();
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
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <TextField field={field} label="Your name" autoComplete="name" />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <TextField
              field={field}
              label="Your email"
              type="email"
              autoComplete="email"
            />
          )}
        </form.Field>
        <form.Field name="message">
          {(field) => <TextAreaField field={field} label="Message" rows={6} />}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            Write email
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
