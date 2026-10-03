import type { Metadata } from "next";
import { PaymentResult } from "@/components/payment/payment-result";
import { LinkButton } from "@/components/shared/link-button";

export const metadata: Metadata = {
  title: "Payment successful",
  robots: { index: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : "";
  const orgId =
    typeof query.organizationId === "string" ? query.organizationId : "";

  if (!sessionId || !orgId) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            We could not find this payment
          </h1>
          <p className="text-muted-foreground">
            The link is missing its payment details. Open the billing page to
            see your payment history.
          </p>
        </div>
        <LinkButton href="/owner/billing" size="lg">
          Go to billing
        </LinkButton>
      </div>
    );
  }

  return <PaymentResult orgId={orgId} sessionId={sessionId} />;
}
