"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Catches errors on any page that has no closer error.tsx.
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-6 px-4"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-destructive">
          Something went wrong
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          We could not load this page
        </h1>
        <p className="text-muted-foreground">
          This is a problem on our side or with your connection. Try again, and
          if it keeps happening, come back in a few minutes.
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.location.assign("/")}
        >
          Go to home
        </Button>
      </div>
    </main>
  );
}
