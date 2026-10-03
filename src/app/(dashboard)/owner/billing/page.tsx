import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { paymentApi } from "@/api";
import { BillingView } from "@/components/owner/billing-view";
import { NoOrganization } from "@/components/owner/no-organization";
import { PageHeader } from "@/components/shared/page-header";
import { getActiveOrganization } from "@/lib/active-org";
import { LIST } from "@/lib/list-config";
import { buildListParams, fromSearchParamsObject } from "@/lib/list-params";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { active } = await getActiveOrganization();

  const header = (
    <PageHeader
      title="Billing"
      description="Choose a plan for this organization and review every payment."
    />
  );

  if (!active) {
    return (
      <>
        {header}
        <NoOrganization />
      </>
    );
  }

  const params = buildListParams(
    fromSearchParamsObject(await searchParams),
    LIST.payments.filters,
    LIST.payments.defaults,
  );

  const state = await prefetch([
    {
      queryKey: queryKeys.org.payments(active.id, params),
      queryFn: () => paymentApi.history(serverRequest, active.id, params),
    },
  ]);

  return (
    <>
      {header}
      <HydrationBoundary state={state}>
        <BillingView
          orgId={active.id}
          orgName={active.name}
          plan={active.subscriptionPlan}
          status={active.subscriptionStatus}
        />
      </HydrationBoundary>
    </>
  );
}
