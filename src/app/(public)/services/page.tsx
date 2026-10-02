import {
  Building2,
  CreditCard,
  FolderKanban,
  History,
  KeyRound,
  ListChecks,
  MessageSquare,
  Search,
  Timer,
  UsersRound,
} from "lucide-react";
import { type Feature, FeatureGrid } from "@/components/marketing/feature-list";
import { PageIntro, Section } from "@/components/marketing/section";
import { LinkButton } from "@/components/shared/link-button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Organizations, teams, projects, sprints, tasks, role based access, Stripe billing and an audit log. See what Workline offers.",
  path: "/services",
});

const GROUPS: { title: string; intro: string; features: Feature[] }[] = [
  {
    title: "Plan the work",
    intro: "Structure that follows how sprint teams already work.",
    features: [
      {
        icon: Building2,
        title: "Organizations",
        text: "One workspace per company or group. Owners can run several organizations and switch between them from the sidebar.",
      },
      {
        icon: UsersRound,
        title: "Teams and members",
        text: "Add people by name and email. New people get an account with a temporary password. Then group them into teams.",
      },
      {
        icon: FolderKanban,
        title: "Projects",
        text: "Track status from active to completed to archived. Link a project to a team and set its dates.",
      },
      {
        icon: Timer,
        title: "Sprints",
        text: "Create sprints with a start and end date. Move them from planned to active to completed, with one active sprint at a time.",
      },
    ],
  },
  {
    title: "Get the work done",
    intro: "Small details that keep tasks moving.",
    features: [
      {
        icon: ListChecks,
        title: "Tasks with priority",
        text: "Low, medium, high or urgent. Add a due date, put the task in a sprint and assign it to a member.",
      },
      {
        icon: ListChecks,
        title: "Subtasks",
        text: "Break a task into steps and tick them off. The checkbox updates instantly.",
      },
      {
        icon: MessageSquare,
        title: "Comments",
        text: "Keep the discussion next to the work, with the author and time on every comment.",
      },
      {
        icon: Search,
        title: "Search, filter and sort",
        text: "Every list can be searched, filtered, sorted and paged. The view is saved in the address, so you can bookmark or share it.",
      },
    ],
  },
  {
    title: "Run it safely",
    intro: "Control over who can see and change what.",
    features: [
      {
        icon: KeyRound,
        title: "Role based access",
        text: "Admin, owner and member areas are protected on the server. A member cannot open an owner page by typing its address.",
      },
      {
        icon: CreditCard,
        title: "Billing with Stripe",
        text: "Upgrade an organization to Pro or Business with Stripe Checkout. Payment history shows the plan, amount and status.",
      },
      {
        icon: History,
        title: "Audit log",
        text: "Creating, updating and deleting records in an organization is logged. Admins can filter the log by type.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="Services"
        description="Workline covers the full path from creating an organization to closing a sprint. Here is what each part does."
      />

      {GROUPS.map((group, index) => (
        <Section
          key={group.title}
          id={`group-${index}`}
          title={group.title}
          intro={group.intro}
          muted={index % 2 === 1}
        >
          <FeatureGrid features={group.features} />
        </Section>
      ))}

      <Section id="try">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border bg-card p-8 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Try each role yourself
            </h2>
            <p className="text-muted-foreground">
              The login page has a demo account for the admin, the owner and the
              member.
            </p>
          </div>
          <LinkButton href="/login" size="lg">
            Go to login
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
