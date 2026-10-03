"use client";

import { Plus, UserMinus, Users } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useListParams, useMembers, useRemoveMember } from "@/hooks";
import { formatDate } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import type { OrganizationMember } from "@/types";
import { InviteMemberDialog } from "./invite-member-dialog";

interface Props {
  orgId: string;
  ownerId: string;
}

export function MembersView({ orgId, ownerId }: Props) {
  const params = useListParams(LIST.members.filters, LIST.members.defaults);
  const query = useMembers(orgId, params);
  const remove = useRemoveMember(orgId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [removing, setRemoving] = useState<OrganizationMember | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setInviteOpen(true)}>
          <Plus aria-hidden="true" />
          Add member
        </Button>
      </div>

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorPanel onRetry={() => query.refetch()} />
      ) : query.data.data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Add people by name and email. They can then be placed in teams and assigned tasks."
          action={
            <Button onClick={() => setInviteOpen(true)}>Add member</Button>
          }
        />
      ) : (
        <>
          <DataTable
            isFetching={query.isFetching}
            rows={query.data.data}
            getKey={(member) => member.id}
            columns={[
              {
                header: "Member",
                cell: (member) => (
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                ),
              },
              {
                header: "Role",
                cell: (member) =>
                  member.userId === ownerId ? (
                    <StatusBadge value="OWNER" />
                  ) : (
                    <StatusBadge value={member.user.role} />
                  ),
              },
              {
                header: "Joined",
                cell: (member) => formatDate(member.joinedAt),
              },
              {
                header: "Action",
                className: "text-right",
                cell: (member) =>
                  member.userId === ownerId ? (
                    <span className="text-xs text-muted-foreground">
                      Organization owner
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRemoving(member)}
                    >
                      <UserMinus aria-hidden="true" />
                      Remove
                    </Button>
                  ),
              },
            ]}
          />
          <UrlPagination meta={query.data.meta} />
        </>
      )}

      <InviteMemberDialog
        orgId={orgId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove this member?"
        description={`${removing?.user.name} will lose access to this organization.`}
        confirmLabel="Remove member"
        destructive
        isPending={remove.isPending}
        onConfirm={() => {
          if (!removing) return;
          remove.mutate(removing.id, { onSettled: () => setRemoving(null) });
        }}
      />
    </div>
  );
}
