import { PlanCards } from "@/components/marketing/plan-cards";
import { PageIntro, Section } from "@/components/marketing/section";
import { LinkButton } from "@/components/shared/link-button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pricing",
  description:
    "Workline has a Free, a Pro and a Business plan. Plans belong to an organization and are paid through Stripe.",
  path: "/pricing",
});

const NOTES = [
  {
    title: "Plans belong to an organization",
    text: "If you own two organizations, each one has its own plan and its own payment history.",
  },
  {
    title: "Only owners can change a plan",
    text: "Owners choose a plan on the billing page. Members and admins cannot start a payment.",
  },
  {
    title: "Payments run through Stripe",
    text: "You are sent to Stripe Checkout to pay, then back to Workline. Card details never touch this app.",
  },
  {
    title: "This project uses Stripe test mode",
    text: "No real money is taken. Use the test card 4242 4242 4242 4242 with any future date and any CVC.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageIntro
        title="Pricing"
        description="Start on the Free plan. Move an organization to Pro or Business from its billing page when you are ready."
      />

      <Section id="plans">
        <PlanCards />
      </Section>

      <Section id="notes" muted title="Before you choose">
        <dl className="grid gap-8 sm:grid-cols-2">
          {NOTES.map((note) => (
            <div key={note.title} className="space-y-1.5">
              <dt className="font-semibold">{note.title}</dt>
              <dd className="text-sm text-muted-foreground">{note.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="start">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border bg-card p-8 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Questions about billing?
            </h2>
            <p className="text-muted-foreground">
              The FAQ covers plans, roles and how the demo works.
            </p>
          </div>
          <LinkButton href="/faq" variant="outline" size="lg">
            Read the FAQ
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
