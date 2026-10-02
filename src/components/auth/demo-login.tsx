"use client";

import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { demoLoginAction } from "@/actions/auth.actions";
import type { DemoRole } from "@/types";

const DEMO_ROLES: {
  role: DemoRole;
  title: string;
  text: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    role: "admin",
    title: "Admin",
    text: "Platform stats, all users and the audit log.",
    icon: ShieldCheck,
  },
  {
    role: "owner",
    title: "Organization owner",
    text: "Projects, sprints, tasks, team and billing.",
    icon: Building2,
  },
  {
    role: "member",
    title: "Team member",
    text: "Assigned tasks, subtasks and comments.",
    icon: UserRound,
  },
];

export function DemoLogin() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<DemoRole | null>(null);

  function login(role: DemoRole) {
    setActive(role);
    startTransition(async () => {
      const result = await demoLoginAction(role);

      if (!result.ok) {
        toast.error(result.message ?? "Demo login failed.");
        setActive(null);
        return;
      }

      router.replace(result.redirectTo ?? "/");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Try a demo account</p>
        <p className="text-sm text-muted-foreground">
          No sign up needed. Pick a role and you are logged in with one click.
        </p>
      </div>

      <div className="grid gap-2">
        {DEMO_ROLES.map((item) => (
          <button
            key={item.role}
            type="button"
            disabled={pending}
            onClick={() => login(item.role)}
            className="flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent disabled:opacity-60"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <item.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                {active === item.role
                  ? "Logging in..."
                  : `Log in as ${item.title}`}
              </span>
              <span className="block text-xs text-muted-foreground">
                {item.text}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
