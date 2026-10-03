"use client";

import { Check, Receipt } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UrlPagination } from "@/components/shared/url-pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCheckout, useListParams, usePayments } from "@/hooks";
import { PLAN_INTERVAL, PLANS } from "@/lib/constants";
import { formatDateTime, formatMoney } from "@/lib/format";
import { LIST } from "@/lib/list-config";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types";

interface Props {
  orgId: string;
  orgName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
}

export function BillingView({ orgId, orgName, plan, status }: Props) {
  const params = useListParams(LIST.payments.filters, LIST.payments.defaults);
  const payments = usePayments(orgId, params);
  const checkout = useCheckout();

  return (
    <div className="space-y-8">
      <section aria-labelledby="plans-heading" className="space-y-4">
        <div>
          <h2 id="plans-heading" className="text-lg font-semibold">
            Plan for {orgName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Current plan: <StatusBadge value={plan} className="ml-1" />{" "}
            <StatusBadge value={status} className="ml-1" />
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((item) => {
            const isCurrent = item.id === plan;

            return (
              <Card
                key={item.id}
                className={isCurrent ? "ring-2 ring-primary" : ""}
              >
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <span className="text-3xl font-semibold tabular-nums">
                      {formatMoney(item.price)}
                    </span>
                    {item.price > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        per {PLAN_INTERVAL}
                      </span>
                    ) : null}
                  </p>

                  {item.id === "FREE" ? (
                    <Button variant="outline" className="w-full" disabled>
                      {isCurrent ? "Current plan" : "Included by default"}
                    </Button>
                  ) : isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Check aria-hidden="true" />
                      Current plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={checkout.isPending}
                      onClick={() =>
                        checkout.mutate({
                          organizationId: orgId,
                          plan: item.id as "PRO" | "BUSINESS",
                        })
                      }
                    >
                      {checkout.isPending &&
                      checkout.variables?.plan === item.id
                        ? "Opening Stripe..."
                        : `Choose ${item.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Payments are handled by Stripe. This project runs in Stripe test mode,
          so use the test card 4242 4242 4242 4242 with any future date and any
          CVC.
        </p>
      </section>

      <section aria-labelledby="history-heading" className="space-y-4">
        <h2 id="history-heading" className="text-lg font-semibold">
          Payment history
        </h2>

        {payments.isPending ? (
          <TableSkeleton rows={4} />
        ) : payments.isError ? (
          <ErrorPanel onRetry={() => payments.refetch()} />
        ) : payments.data.data.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description="When you upgrade this organization, each payment will be listed here."
          />
        ) : (
          <>
            <DataTable
              isFetching={payments.isFetching}
              rows={payments.data.data}
              getKey={(payment) => payment.id}
              columns={[
                {
                  header: "Date",
                  cell: (payment) => formatDateTime(payment.createdAt),
                },
                {
                  header: "Plan",
                  cell: (payment) => <StatusBadge value={payment.plan} />,
                },
                {
                  header: "Amount",
                  className: "tabular-nums",
                  cell: (payment) =>
                    formatMoney(payment.amount, payment.currency),
                },
                {
                  header: "Status",
                  cell: (payment) => <StatusBadge value={payment.status} />,
                },
              ]}
            />
            <UrlPagination meta={payments.data.meta} />
          </>
        )}
      </section>
    </div>
  );
}
