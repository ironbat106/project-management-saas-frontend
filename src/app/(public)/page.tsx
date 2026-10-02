import {
  Building2,
  CreditCard,
  FolderKanban,
  ListChecks,
  ScrollText,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { FeatureGrid } from "@/components/marketing/feature-list";
import { PlanCards } from "@/components/marketing/plan-cards";
import { Section } from "@/components/marketing/section";
import { TaskFlow } from "@/components/marketing/task-flow";
import { LinkButton } from "@/components/shared/link-button";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Workline | Project management for sprint teams",
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

const FEATURES = [
  {
    icon: Building2,
    title: "Organizations and teams",
    text: "Create an organization, add members by email and group them into teams. Each organization keeps its own projects and tasks.",
  },
  {
    icon: FolderKanban,
    title: "Projects with a clear status",
    text: "Every project is active, completed or archived, with start and end dates and an optional team.",
  },
  {
    icon: Timer,
    title: "Sprints",
    text: "Plan work in fixed periods. Only one sprint per project can be active, so the current focus is never unclear.",
  },
  {
    icon: ListChecks,
    title: "Tasks, subtasks and comments",
    text: "Set priority and due dates, assign people, tick off subtasks and discuss the work on the task itself.",
  },
  {
    icon: ShieldCheck,
    title: "Access by role",
    text: "Admins, organization owners and team members each get their own area, enforced on the server and in the interface.",
  },
  {
    icon: CreditCard,
    title: "Plans with Stripe",
    text: "Owners upgrade an organization through Stripe Checkout and see every payment in a history table.",
  },
];

const STEPS = [
  {
    title: "Create an organization",
    text: "Sign up, name your workspace and add the people who work with you.",
  },
  {
    title: "Plan a project",
    text: "Add a project, create a sprint and break the work into tasks with owners and due dates.",
  },
  {
    title: "Follow the progress",
    text: "Members update their tasks. Owners and admins read the charts and the audit log.",
  },
];

const ROLES = [
  {
    name: "Admin",
    text: "Sees the whole platform: users, organizations, plan mix and the audit log. Can block or unblock accounts.",
  },
  {
    name: "Organization owner",
    text: "Runs a workspace: teams, members, projects, sprints, tasks and billing.",
  },
  {
    name: "Team member",
    text: "Works on assigned tasks: moves them forward, adds subtasks and leaves comments.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Plan sprints, assign tasks and track delivery in one workspace
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Workline organizes your teams, projects, sprints and tasks, with a
              separate view for admins, organization owners and team members.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/login" size="lg">
                Try a demo account
              </LinkButton>
              <LinkButton href="/register" variant="outline" size="lg">
                Create an account
              </LinkButton>
            </div>
            <p className="text-sm text-muted-foreground">
              The demo needs no sign up. Pick a role on the login page.
            </p>
          </div>
          <TaskFlow />
        </div>
      </section>

      <Section
        id="features"
        title="What you can do with Workline"
        intro="Everything here is part of the working product. There is nothing to configure before you start."
      >
        <FeatureGrid features={FEATURES} />
        <div className="mt-10">
          <LinkButton href="/services" variant="outline" size="lg">
            See all services
          </LinkButton>
        </div>
      </Section>

      <Section
        id="how"
        muted
        title="How it works"
        intro="From an empty account to a running sprint in three steps."
      >
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="space-y-2">
              <span className="text-sm font-semibold text-primary tabular-nums">
                Step {index + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="roles"
        title="Three roles, three workspaces"
        intro="Each person only sees what their role needs."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {ROLES.map((role) => (
            <div key={role.name} className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold">{role.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{role.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <ScrollText className="size-4" aria-hidden="true" />
          Every change in an organization is written to an audit log that admins
          can read.
        </div>
      </Section>

      <Section
        id="pricing"
        muted
        title="Plans"
        intro="Start free. Upgrade an organization when you need to."
      >
        <PlanCards />
      </Section>

      <Section id="start">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border bg-card p-8 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              See it with real data
            </h2>
            <p className="text-muted-foreground">
              Log in as an admin, an owner or a member with one click.
            </p>
          </div>
          <LinkButton href="/login" size="lg">
            Open the demo
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
