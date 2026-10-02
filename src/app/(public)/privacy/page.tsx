import { LegalPage } from "@/components/marketing/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy policy",
  description:
    "What data Workline stores, why it is stored and how it is protected.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      description={`This page explains what ${SITE_NAME} stores about you and how it is used.`}
      updated="30 September 2026"
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            Your name, email address and a hashed version of your password when
            you create an account.
          </li>
          <li>
            The organizations, teams, projects, sprints, tasks, subtasks and
            comments you create.
          </li>
          <li>
            An activity record of changes made in an organization, such as who
            created or updated a task.
          </li>
          <li>
            Payment records: the plan, amount, status and Stripe reference
            numbers.
          </li>
        </ul>
        <p>
          Card numbers are entered on Stripe, not on this site, and are never
          stored by {SITE_NAME}.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <p>
          The data is used only to run the service: to log you in, show your
          work to the right people, keep a history of changes and record plan
          changes. We do not sell your data and we do not show advertising.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          {SITE_NAME} uses only the cookies it needs to work. They keep you
          logged in and remember which organization you selected. These cookies
          cannot be read by page scripts. There are no analytics or advertising
          cookies.
        </p>
      </section>

      <section>
        <h2>Who can see your data</h2>
        <ul>
          <li>
            Members of an organization can see that organization&apos;s projects
            and tasks.
          </li>
          <li>
            Platform admins can see accounts, organizations and the activity
            log.
          </li>
          <li>Stripe processes payments under its own privacy policy.</li>
        </ul>
      </section>

      <section>
        <h2>Keeping and deleting data</h2>
        <p>
          Data stays while your account or organization exists. Deleting an
          organization removes it from the app. To ask for your account to be
          removed, email {CONTACT_EMAIL}.
        </p>
      </section>

      <section>
        <h2>Project notice</h2>
        <p>
          {SITE_NAME} is a university project and runs Stripe in test mode. Do
          not enter real payment cards, and avoid entering sensitive personal
          information.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about this policy can be sent to {CONTACT_EMAIL}.</p>
      </section>
    </LegalPage>
  );
}
