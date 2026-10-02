import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Logo />
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Plan the sprint. Assign the work. See it finish.
          </h2>
          <p className="text-primary-foreground/80">
            Workline keeps organizations, teams, projects, sprints and tasks in
            one place, with the right access for every role.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">
          Built as a university project with Next.js.
        </p>
      </aside>

      <main
        id="main"
        className="flex items-center justify-center px-4 py-10 sm:px-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
