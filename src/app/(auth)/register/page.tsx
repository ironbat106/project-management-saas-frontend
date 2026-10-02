import { RegisterForm } from "@/components/auth/register-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create account",
  description: "Create a Workline account and set up your first organization.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          New accounts start as organization owners. You can create an
          organization right after signing up.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
