"use client";

import { CircleCheck, Clock, TriangleAlert } from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentBySession } from "@/hooks";
import { formatDateTime, formatLabel, formatMoney } from "@/lib/format";

interface Props {
  orgId: string;
  sessionId: string;
}

export function PaymentResult({ orgId, sessionId }: Props) {
  const query = usePaymentBySession(orgId, sessionId);

  if (query.isPending) {
    return (
      <div className="w-full space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const payment = query.data;

  if (payment?.status === "PAID") {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <CircleCheck className="size-9 text-emerald-600" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment received
          </h1>
          <p className="text-muted-foreground">
            Your organization is now on the {formatLabel(payment.plan)} plan.
          </p>
        </div>

        <dl className="divide-y rounded-lg border bg-card text-sm">
          <Row label="Plan" value={formatLabel(payment.plan)} />
          <Row
            label="Amount"
            value={formatMoney(payment.amount, payment.currency)}
          />
          <Row label="Date" value={formatDateTime(payment.createdAt)} />
          <Row label="Reference" value={sessionId.slice(-12)} />
        </dl>

        <div className="flex flex-wrap gap-2">
          <LinkButton href="/owner/billing" size="lg">
            Go to billing
          </LinkButton>
          <LinkButton href="/owner" variant="outline" size="lg">
            Back to overview
          </LinkButton>
        </div>
      </div>
    );
  }

  if (payment && payment.status !== "PENDING") {
    return (
      <Message
        icon={
          <TriangleAlert
            className="size-9 text-destructive"
            aria-hidden="true"
          />
        }
        title="This payment did not go through"
        text={`Its status is ${formatLabel(payment.status).toLowerCase()}. You have not been charged for the new plan. You can try again from the billing page.`}
      />
    );
  }

  return (
    <Message
      icon={<Clock className="size-9 text-amber-600" aria-hidden="true" />}
      title="Confirming your payment"
      text="Stripe has sent you back, but its confirmation has not reached us yet. This page checks again every few seconds for about 20 seconds. If it does not change, open the billing page in a moment to see the latest status."
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Message({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        {icon}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{text}</p>
      </div>
      <LinkButton href="/owner/billing" size="lg">
        Go to billing
      </LinkButton>
    </div>
  );
}
