import type { Metadata } from "next";
import { ProfileForms } from "@/components/profile/profile-forms";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentUser } from "@/lib/current-user";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account details and password."
      />
      <ProfileForms user={user} />
    </>
  );
}
