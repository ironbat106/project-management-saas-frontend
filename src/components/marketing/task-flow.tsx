import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";

// Shows the real task workflow enforced by the backend.
export function TaskFlow() {
  const steps = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium">How a task moves</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Tasks follow a fixed path, so nothing jumps straight to done.
      </p>
      <ol className="mt-5 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <StatusBadge value={step} className="px-2.5 py-1 text-sm" />
            {index < steps.length - 1 ? (
              <ArrowRight
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t pt-4 text-sm text-muted-foreground">
        Sent back from review? A task can return to in progress. Finished work
        can be reopened the same way.
      </p>
    </div>
  );
}
