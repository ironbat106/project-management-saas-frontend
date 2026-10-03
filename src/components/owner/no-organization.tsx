import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";

export function NoOrganization() {
  return (
    <EmptyState
      icon={Building2}
      title="Create your first organization"
      description="An organization is the workspace that holds your teams, projects and tasks."
      action={
        <LinkButton href="/owner/organizations">Create organization</LinkButton>
      }
    />
  );
}
