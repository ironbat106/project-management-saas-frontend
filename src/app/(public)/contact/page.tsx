import { Mail } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageIntro, Section } from "@/components/marketing/section";
import { CONTACT_EMAIL } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the Workline project by email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="Contact"
        description="Have a question about the project or found a problem? Send a message."
      />

      <Section id="contact">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-xl">
            <ContactForm />
          </div>

          <aside className="space-y-4">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="flex items-center gap-2 text-sm">
              <Mail
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              The form on this page opens your own email app with the message
              filled in, so nothing is stored on this site.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}