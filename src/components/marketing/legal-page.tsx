import type { ReactNode } from "react";
import { PageIntro } from "./section";

export function LegalPage({
  title,
  description,
  updated,
  children,
}: {
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageIntro title={title} description={description} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:px-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-sm [&_p]:leading-6 [&_p]:text-muted-foreground [&_li]:text-sm [&_li]:leading-6 [&_li]:text-muted-foreground [&_section]:space-y-2 [&_ul]:space-y-1">
        <p>Last updated: {updated}</p>
        {children}
      </div>
    </>
  );
}
