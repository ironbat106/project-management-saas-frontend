import type { CheckoutResult, ListParams, Payment, Requester } from "@/types";

export const paymentApi = {
  checkout: (
    request: Requester,
    body: { organizationId: string; plan: "PRO" | "BUSINESS" },
  ) => request<CheckoutResult>("/payments/checkout", { method: "POST", body }),

  history: (request: Requester, orgId: string, params: ListParams = {}) =>
    request<Payment[]>(`/payments/organizations/${orgId}`, { query: params }),
};
