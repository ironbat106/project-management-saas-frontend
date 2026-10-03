import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/shared/link-button";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <CircleX className="size-9 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground">
          You left the Stripe checkout before paying, so nothing was charged and
          your plan has not changed.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <LinkButton href="/owner/billing" size="lg">
          Choose a plan again
        </LinkButton>
        <LinkButton href="/owner" variant="outline" size="lg">
          Back to overview
        </LinkButton>
      </div>
    </div>
  );
}
