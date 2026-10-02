"use client";

import { useTransition } from "react";
import { switchOrganizationAction } from "@/actions/auth.actions";
import type { Organization } from "@/types";

interface Props {
  organizations: Organization[];
  activeId?: string;
}

export function OrgSwitcher({ organizations, activeId }: Props) {
  const [pending, startTransition] = useTransition();

  if (organizations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
        No organization yet. Create one to start.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor="org-switcher"
        className="px-1 text-xs font-medium text-muted-foreground"
      >
        Organization
      </label>
      <select
        id="org-switcher"
        value={activeId}
        disabled={pending}
        onChange={(event) =>
          startTransition(() => switchOrganizationAction(event.target.value))
        }
        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
    </div>
  );
}
