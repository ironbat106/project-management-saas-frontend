"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddTeamMember, useRemoveTeamMember } from "@/hooks";
import type { OrganizationMember, Team } from "@/types";

interface Props {
  orgId: string;
  team: Team;
  orgMembers: OrganizationMember[];
}

export function TeamCard({ orgId, team, orgMembers }: Props) {
  const add = useAddTeamMember(orgId);
  const remove = useRemoveTeamMember(orgId);
  const [selected, setSelected] = useState("");

  const inTeam = new Set(team.members.map((member) => member.userId));
  const available = orgMembers.filter((member) => !inTeam.has(member.userId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>
          {team._count.members} members, {team._count.projects} projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {team.members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No members in this team yet.
          </p>
        ) : (
          <ul className="space-y-1">
            {team.members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {member.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={remove.isPending}
                  onClick={() =>
                    remove.mutate({ teamId: team.id, userId: member.userId })
                  }
                >
                  <X aria-hidden="true" />
                  <span className="sr-only">Remove {member.user.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <select
            aria-label={`Add a member to ${team.name}`}
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">
              {available.length === 0
                ? "Everyone is in this team"
                : "Choose a member"}
            </option>
            {available.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            disabled={!selected || add.isPending}
            onClick={() =>
              add.mutate(
                { teamId: team.id, userId: selected },
                { onSuccess: () => setSelected("") },
              )
            }
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
