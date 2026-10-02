import type { SubscriptionPlan } from "./organization.type";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface Payment {
  id: string;
  plan: SubscriptionPlan;
  amount: string;
  currency: string;
  status: PaymentStatus;
  stripeCheckoutSessionId: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResult {
  checkoutUrl: string | null;
}
