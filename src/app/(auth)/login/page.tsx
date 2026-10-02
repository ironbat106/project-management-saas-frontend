import { DemoLogin } from "@/components/auth/demo-login";
import { LoginForm } from "@/components/auth/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Log in",
  description:
    "Log in to your Workline account, or try a demo account with one click.",
  path: "/login",
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const next = typeof query.next === "string" ? query.next : undefined;
  const sessionEnded = query.reason === "session";

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to your account to continue.
        </p>
      </div>

      {sessionEnded ? (
        <output className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Your session ended. Please log in again.
        </output>
      ) : null}

      <LoginForm next={next} />

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <DemoLogin />
    </>
  );
}
