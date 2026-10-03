"use client";

import { Plus, UsersRound } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { SortSelect } from "@/components/shared/sort-select";
import { PageSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useListParams, useMembers, useTeams } from "@/hooks";
import { LIST } from "@/lib/list-config";
import { TeamCard } from "./team-card";
import { TeamFormDialog } from "./team-form-dialog";

export function TeamsView({ orgId }: { orgId: string }) {
  const params = useListParams(LIST.teams.filters, LIST.teams.defaults);
  const teams = useTeams(orgId, params);
  // All members of the organization, used by the "add a member" dropdowns.
  const members = useMembers(orgId, { limit: 100 });
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SortSelect
          options={[
            { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
            { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
            { label: "Name A to Z", sortBy: "name", sortOrder: "asc" },
          ]}
        />
        <Button className="ml-auto" onClick={() => setFormOpen(true)}>
          <Plus aria-hidden="true" />
          New team
        </Button>
      </div>

      {teams.isPending ? (
        <PageSkeleton />
      ) : teams.isError ? (
        <ErrorPanel onRetry={() => teams.refetch()} />
      ) : teams.data.data.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No teams yet"
          description="Create a team, then add members to it. Projects can be linked to a team."
          action={
            <Button onClick={() => setFormOpen(true)}>Create team</Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.data.data.map((team) => (
              <TeamCard
                key={team.id}
                orgId={orgId}
                team={team}
                orgMembers={members.data?.data ?? []}
              />
            ))}
          </div>
          <UrlPagination meta={teams.data.meta} />
        </>
      )}

      <TeamFormDialog
        orgId={orgId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
