import { ChevronDown } from "lucide-react";
import { PageIntro, Section } from "@/components/marketing/section";
import { LinkButton } from "@/components/shared/link-button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Answers about roles, adding members, sprints, billing and the demo accounts in Workline.",
  path: "/faq",
});

const QUESTIONS = [
  {
    q: "Who can create an organization?",
    a: "Anyone who signs up. New accounts start as organization owners, and an owner can create more than one organization.",
  },
  {
    q: "What can each role do?",
    a: "Admins see platform wide numbers, users, organizations and the audit log. Owners manage their organizations, teams, projects, sprints, tasks and billing. Members work on the tasks assigned to them.",
  },
  {
    q: "How do I add someone to my organization?",
    a: "Open Members and choose Add member. Enter their name and email. If they have no account yet, one is created and you are shown a temporary password once. Share it with them so they can log in.",
  },
  {
    q: "Why can I not move a task straight to done?",
    a: "Tasks follow a fixed path: to do, in progress, in review, then done. Sprints go from planned to active to completed, and only one sprint per project can be active.",
  },
  {
    q: "Can members change any task?",
    a: "Members can change the status of tasks assigned to them, add subtasks and write comments. Owners can change any task in their organization.",
  },
  {
    q: "How does billing work?",
    a: "Plans belong to an organization. An owner picks Pro or Business on the billing page and pays on Stripe Checkout. The result appears in the payment history.",
  },
  {
    q: "Is real money charged?",
    a: "No. This project runs in Stripe test mode. Use card number 4242 4242 4242 4242 with any future expiry date and any CVC.",
  },
  {
    q: "How do the demo accounts work?",
    a: "The login page has one button each for an admin, an owner and a member. Each one logs you in to a ready made account so you can see that role without signing up.",
  },
  {
    q: "How are passwords and sessions handled?",
    a: "Passwords are hashed by the backend and never stored as plain text. Sessions use secure cookies that page scripts cannot read.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageIntro
        title="Frequently asked questions"
        description="Short answers about how Workline works. If yours is not here, use the contact page."
      />

      <Section id="questions">
        <div className="max-w-3xl divide-y rounded-lg border bg-card">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group px-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-4 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Still have a question?
          </p>
          <LinkButton href="/contact" variant="outline">
            Contact us
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
