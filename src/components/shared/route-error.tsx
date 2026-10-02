"use client";

import { useEffect } from "react";
import { ErrorPanel } from "./error-panel";

export function RouteError({
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
    <div className="mx-auto w-full max-w-xl py-10">
      <ErrorPanel
        title="Something went wrong on this page"
        message="Please try again. If the problem continues, log out and log back in."
        onRetry={reset}
      />
    </div>
  );
}
