import { LegalPage } from "@/components/marketing/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms and conditions",
  description:
    "The rules for using Workline, including accounts, payments and acceptable use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and conditions"
      description={`By using ${SITE_NAME} you agree to these terms. They are written in plain language.`}
      updated="30 September 2026"
    >
      <section>
        <h2>Your account</h2>
        <p>
          You are responsible for the information you give when you sign up and
          for keeping your password private. Tell us if you think someone else
          has used your account.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>
            Do not try to access accounts or organizations that are not yours.
          </li>
          <li>Do not upload unlawful, harmful or abusive content.</li>
          <li>Do not attempt to disrupt or overload the service.</li>
        </ul>
        <p>Admins may block an account that breaks these rules.</p>
      </section>

      <section>
        <h2>Organizations and content</h2>
        <p>
          Owners are responsible for the people they add to an organization and
          for the content in it. You keep ownership of the content you create.
        </p>
      </section>

      <section>
        <h2>Plans and payments</h2>
        <p>
          Paid plans are bought through Stripe Checkout. In this project Stripe
          runs in test mode, so no real money is charged and no real card should
          be used. Plan changes are recorded in the payment history.
        </p>
      </section>

      <section>
        <h2>No guarantee of service</h2>
        <p>
          {SITE_NAME} is a university project. It is provided as it is, without
          promises about uptime or that data will never be lost. Do not rely on
          it for critical work.
        </p>
      </section>

      <section>
        <h2>Ending your use</h2>
        <p>
          You can stop using the service at any time. We may suspend accounts
          that break these terms.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms. The date at the top of the page shows the
          latest version.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to {CONTACT_EMAIL}.</p>
      </section>
    </LegalPage>
  );
}
