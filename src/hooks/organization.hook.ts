"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { organizationApi, teamApi } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import { browserRequest } from "@/lib/request-browser";
import type { ListParams } from "@/types";

export function useOrganizations(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.organizations.list(params),
    queryFn: () => organizationApi.list(browserRequest, params),
    placeholderData: (previous) => previous,
  });
}

export function useCreateOrganization() {
  const client = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      organizationApi.create(browserRequest, body),
    onSuccess: () => {
      toast.success("Organization created");
      client.invalidateQueries({ queryKey: queryKeys.organizations.all });
      router.refresh();
    },
  });
}

export function useUpdateOrganization() {
  const client = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: {
      id: string;
      body: { name?: string; description?: string };
    }) => organizationApi.update(browserRequest, input.id, input.body),
    onSuccess: () => {
      toast.success("Organization updated");
      client.invalidateQueries({ queryKey: queryKeys.organizations.all });
      router.refresh();
    },
  });
}

export function useDeleteOrganization() {
  const client = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => organizationApi.remove(browserRequest, id),
    onSuccess: () => {
      toast.success("Organization deleted");
      client.invalidateQueries({ queryKey: queryKeys.organizations.all });
      router.refresh();
    },
  });
}

export function useOrgOverview(orgId: string) {
  return useQuery({
    queryKey: queryKeys.org.overview(orgId),
    queryFn: () => organizationApi.overview(browserRequest, orgId),
  });
}

export function useMembers(orgId: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.org.members(orgId, params),
    queryFn: () => organizationApi.members(browserRequest, orgId, params),
    placeholderData: (previous) => previous,
  });
}

export function useInviteMember(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; email: string }) =>
      organizationApi.invite(browserRequest, orgId, body),
    onSuccess: () => {
      toast.success("Member added to the organization");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useRemoveMember(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      organizationApi.removeMember(browserRequest, orgId, memberId),
    onSuccess: () => {
      toast.success("Member removed");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useTeams(orgId: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.org.teams(orgId, params),
    queryFn: () => teamApi.list(browserRequest, orgId, params),
    placeholderData: (previous) => previous,
  });
}

export function useCreateTeam(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string }) =>
      teamApi.create(browserRequest, orgId, body),
    onSuccess: () => {
      toast.success("Team created");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useAddTeamMember(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { teamId: string; userId: string }) =>
      teamApi.addMember(browserRequest, input.teamId, input.userId),
    onSuccess: () => {
      toast.success("Member added to the team");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useRemoveTeamMember(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { teamId: string; userId: string }) =>
      teamApi.removeMember(browserRequest, input.teamId, input.userId),
    onSuccess: () => {
      toast.success("Member removed from the team");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}
