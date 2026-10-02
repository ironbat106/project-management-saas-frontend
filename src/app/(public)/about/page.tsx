import { PageIntro, Section } from "@/components/marketing/section";
import { LinkButton } from "@/components/shared/link-button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "Why Workline exists, how it is built and how its three roles fit together.",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "Structure first",
    text: "Work is organized from organization to team to project to sprint to task. Each level has a clear owner and a clear status.",
  },
  {
    title: "Rules the system enforces",
    text: "Tasks, sprints and projects can only move through allowed statuses. The screens offer only the moves the server accepts.",
  },
  {
    title: "Each role sees its own area",
    text: "Admins, owners and members have separate pages. Access is checked on the server, not only hidden in the interface.",
  },
  {
    title: "Nothing hidden behind a mock",
    text: "Every list, chart and payment on the site comes from the live backend API.",
  },
];

const STACK = [
  {
    label: "Frontend",
    value: "Next.js App Router, TypeScript, Tailwind CSS and shadcn/ui",
  },
  { label: "Data and forms", value: "TanStack Query, TanStack Form and Zod" },
  { label: "Backend", value: "Express, Prisma, PostgreSQL and Redis" },
  { label: "Payments", value: "Stripe Checkout in test mode" },
  { label: "Hosting", value: "Vercel for both the frontend and the backend" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="About Workline"
        description="Workline is a project management platform for teams that plan in sprints. It was built as a full stack university project."
      />

      <Section id="why" title="Why it exists">
        <div className="max-w-2xl space-y-4 text-muted-foreground">
          <p>
            Small teams often track work in a mix of chat threads, documents and
            spreadsheets. It is hard to see who owns a task, what is in the
            current sprint or what is already done.
          </p>
          <p>
            Workline puts that in one place. An owner creates an organization,
            adds people, plans projects and sprints, and assigns tasks. Members
            update their own work. Admins keep an eye on the whole platform.
          </p>
        </div>
      </Section>

      <Section id="principles" muted title="How it is designed">
        <dl className="grid gap-8 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="space-y-1.5">
              <dt className="font-semibold">{item.title}</dt>
              <dd className="text-sm text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="stack" title="How it is built">
        <dl className="divide-y rounded-lg border bg-card">
          {STACK.map((item) => (
            <div
              key={item.label}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr]"
            >
              <dt className="text-sm font-medium">{item.label}</dt>
              <dd className="text-sm text-muted-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="try" muted>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Have a look around
            </h2>
            <p className="text-muted-foreground">
              Use a demo account to see each role, or get in touch with a
              question.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/login" size="lg">
              Try the demo
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Contact
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
