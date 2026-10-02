import type { Metadata } from "next";
import { LinkButton } from "@/components/shared/link-button";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main
        id="main"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-16"
      >
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">Error 404</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            This page does not exist
          </h1>
          <p className="text-muted-foreground">
            The link may be old, or the page may have been moved. Check the
            address, or go back to a page that does exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/" size="lg">
            Go to home
          </LinkButton>
          <LinkButton href="/login" variant="outline" size="lg">
            Log in
          </LinkButton>
        </div>
      </main>
    </div>
  );
}
