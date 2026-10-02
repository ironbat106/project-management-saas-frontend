import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}

export function Section({
  title,
  intro,
  children,
  className,
  muted,
  id,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={cn("py-16 sm:py-20", muted && "border-y bg-secondary/40")}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>
        {title ? (
          <div className="mb-10 max-w-2xl space-y-3">
            <h2
              id={id ? `${id}-title` : undefined}
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {title}
            </h2>
            {intro ? <p className="text-muted-foreground">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b bg-secondary/40">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
