import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { organizationApi } from "@/api";
import { ORG_COOKIE } from "@/lib/constants";
import { serverRequest } from "@/lib/request-server";

const getOrganizations = cache(async () => {
  const response = await organizationApi.list(serverRequest, {
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "asc",
  });
  return response.data;
});

export async function getActiveOrganization() {
  const organizations = await getOrganizations();
  const saved = (await cookies()).get(ORG_COOKIE)?.value;
  const active =
    organizations.find((organization) => organization.id === saved) ??
    organizations[0] ??
    null;

  return { organizations, active };
}

export async function requireActiveOrganization() {
  const { active } = await getActiveOrganization();
  if (!active) redirect("/owner/organizations");
  return active;
}
