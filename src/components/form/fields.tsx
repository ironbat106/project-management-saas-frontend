"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps, ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function visibleErrors(field: AnyFieldApi) {
  const { isTouched, isValid, errors } = field.state.meta;
  return isTouched && !isValid ? errors : [];
}

interface BaseProps {
  field: AnyFieldApi;
  label: string;
  description?: string;
}

function FieldShell({
  field,
  label,
  description,
  children,
}: BaseProps & { children: ReactNode }) {
  const errors = visibleErrors(field);

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children}
      {description && errors.length === 0 ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
      <FieldError errors={errors} />
    </Field>
  );
}

type InputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "name" | "id"
>;

export function TextField({
  field,
  label,
  description,
  className,
  ...props
}: BaseProps & InputProps) {
  return (
    <FieldShell field={field} label={label} description={description}>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={visibleErrors(field).length > 0}
        className={cn("h-9", className)}
        {...props}
      />
    </FieldShell>
  );
}

type TextareaProps = Omit<
  ComponentProps<typeof Textarea>,
  "value" | "onChange" | "onBlur" | "name" | "id"
>;

export function TextAreaField({
  field,
  label,
  description,
  ...props
}: BaseProps & TextareaProps) {
  return (
    <FieldShell field={field} label={label} description={description}>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={visibleErrors(field).length > 0}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectProps extends BaseProps {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  field,
  label,
  description,
  options,
  placeholder,
}: SelectProps) {
  return (
    <FieldShell field={field} label={label} description={description}>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
