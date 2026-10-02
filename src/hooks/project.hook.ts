"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type ProjectPayload, projectApi, sprintApi } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import { browserRequest } from "@/lib/request-browser";
import type { ListParams, ProjectStatus, SprintStatus } from "@/types";

export function useProjects(orgId: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.org.projects(orgId, params),
    queryFn: () => projectApi.list(browserRequest, orgId, params),
    placeholderData: (previous) => previous,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.detail(projectId),
    queryFn: () => projectApi.get(browserRequest, projectId),
  });
}

export function useCreateProject(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (body: ProjectPayload) =>
      projectApi.create(browserRequest, orgId, body),
    onSuccess: () => {
      toast.success("Project created");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useUpdateProject(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; body: ProjectPayload }) =>
      projectApi.update(browserRequest, input.id, input.body),
    onSuccess: (_data, input) => {
      toast.success("Project updated");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
      client.invalidateQueries({ queryKey: queryKeys.project.root(input.id) });
    },
  });
}

export function useUpdateProjectStatus(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; status: ProjectStatus }) =>
      projectApi.updateStatus(browserRequest, input.id, input.status),
    onSuccess: (_data, input) => {
      toast.success("Project status updated");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
      client.invalidateQueries({ queryKey: queryKeys.project.root(input.id) });
    },
  });
}

export function useDeleteProject(orgId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.remove(browserRequest, id),
    onSuccess: () => {
      toast.success("Project deleted");
      client.invalidateQueries({ queryKey: queryKeys.org.root(orgId) });
    },
  });
}

export function useSprints(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project.sprints(projectId),
    queryFn: () => sprintApi.list(browserRequest, projectId),
  });
}

export function useCreateSprint(projectId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; startDate: string; endDate: string }) =>
      sprintApi.create(browserRequest, projectId, body),
    onSuccess: () => {
      toast.success("Sprint created");
      client.invalidateQueries({ queryKey: queryKeys.project.root(projectId) });
    },
  });
}

export function useUpdateSprintStatus(projectId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; status: SprintStatus }) =>
      sprintApi.updateStatus(browserRequest, input.id, input.status),
    onSuccess: () => {
      toast.success("Sprint status updated");
      client.invalidateQueries({ queryKey: queryKeys.project.root(projectId) });
    },
  });
}
