"use client";

import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ApiError, getErrorMessage } from "@/lib/api-error";

function handleError(error: unknown) {
  // The session is no longer valid. Clear it and go to the login page.
  if (error instanceof ApiError && error.status === 401) {
    window.location.assign("/api/auth/clear");
    return;
  }
  toast.error(getErrorMessage(error), { id: "api-error" });
}

function makeQueryClient() {
  return new QueryClient({
    // Every failed request shows a toast. No error is ever silent.
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        // Data prefetched on the server stays fresh for a minute,
        // so the browser does not fetch it again straight away.
        staleTime: 60 * 1000,
        retry: (count, error) =>
          !(
            error instanceof ApiError &&
            error.status < 500 &&
            error.status > 0
          ) && count < 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
