"use client";

import {
  type Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import { browserRequest } from "@/lib/request-browser";
import type { ApiEnvelope, ListParams, User } from "@/types";

export function useAdminOverview() {
  return useQuery({
    queryKey: queryKeys.admin.overview,
    queryFn: () => adminApi.overview(browserRequest),
  });
}

export function useAdminUsers(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => adminApi.users(browserRequest, params),
    placeholderData: (previous) => previous,
  });
}

const isUsersQuery = (query: Query) =>
  query.queryKey[0] === "admin" && query.queryKey[1] === "users";

export function useSetUserStatus() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      adminApi.setUserStatus(browserRequest, input.id, input.status),
    onMutate: async ({ id, status }) => {
      await client.cancelQueries({ predicate: isUsersQuery });
      const snapshots = client.getQueriesData<ApiEnvelope<User[]>>({
        predicate: isUsersQuery,
      });

      client.setQueriesData<ApiEnvelope<User[]>>(
        { predicate: isUsersQuery },
        (old) =>
          old && {
            ...old,
            data: old.data.map((user) =>
              user.id === id ? { ...user, status } : user,
            ),
          },
      );

      return { snapshots };
    },
    onError: (_error, _input, context) => {
      for (const [key, data] of context?.snapshots ?? []) {
        client.setQueryData(key, data);
      }
    },
    onSuccess: (_data, input) =>
      toast.success(
        input.status === "BLOCKED" ? "User blocked" : "User unblocked",
      ),
    onSettled: () => client.invalidateQueries({ predicate: isUsersQuery }),
  });
}

export function useAdminOrganizations(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.admin.organizations(params),
    queryFn: () => adminApi.organizations(browserRequest, params),
    placeholderData: (previous) => previous,
  });
}

export function useAuditLogs(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs(params),
    queryFn: () => adminApi.auditLogs(browserRequest, params),
    placeholderData: (previous) => previous,
  });
}
