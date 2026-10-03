import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { organizationApi } from "@/api";
import { NoOrganization } from "@/components/owner/no-organization";
import { OwnerOverview } from "@/components/owner/owner-overview";
import { LinkButton } from "@/components/shared/link-button";
import { PageHeader } from "@/components/shared/page-header";
import { getActiveOrganization } from "@/lib/active-org";
import { prefetch } from "@/lib/prefetch";
import { queryKeys } from "@/lib/query-keys";
import { serverRequest } from "@/lib/request-server";

export const metadata: Metadata = { title: "Overview" };

export default async function OwnerPage() {
  const { active } = await getActiveOrganization();

  if (!active) {
    return (
      <>
        <PageHeader title="Overview" />
        <NoOrganization />
      </>
    );
  }

  const state = await prefetch([
    {
      queryKey: queryKeys.org.overview(active.id),
      queryFn: () => organizationApi.overview(serverRequest, active.id),
    },
  ]);

  return (
    <>
      <PageHeader
        title={active.name}
        description="How your projects and tasks are doing right now."
        actions={<LinkButton href="/owner/projects">View projects</LinkButton>}
      />
      <HydrationBoundary state={state}>
        <OwnerOverview orgId={active.id} />
      </HydrationBoundary>
    </>
  );
}
