"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import { browserRequest } from "@/lib/request-browser";
import type { ListParams } from "@/types";

export function usePayments(orgId: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.org.payments(orgId, params),
    queryFn: () => paymentApi.history(browserRequest, orgId, params),
    placeholderData: (previous) => previous,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (body: { organizationId: string; plan: "PRO" | "BUSINESS" }) =>
      paymentApi.checkout(browserRequest, body),
    onSuccess: (response) => {
      if (response.data.checkoutUrl) {
        window.location.assign(response.data.checkoutUrl);
      }
    },
  });
}

export function usePaymentBySession(orgId: string, sessionId: string) {
  return useQuery({
    queryKey: [...queryKeys.org.root(orgId), "payment-session", sessionId],
    queryFn: async () => {
      const response = await paymentApi.history(browserRequest, orgId, {
        limit: 20,
      });
      return (
        response.data.find(
          (payment) => payment.stripeCheckoutSessionId === sessionId,
        ) ?? null
      );
    },
    refetchInterval: (query) =>
      query.state.data?.status === "PAID" || query.state.dataUpdateCount >= 10
        ? false
        : 2000,
  });
}
