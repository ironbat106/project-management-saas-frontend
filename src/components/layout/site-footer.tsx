import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms and conditions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Project management for teams that plan in sprints.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-primary hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {COLUMNS.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="space-y-3"
          >
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          {new Date().getFullYear()} {SITE_NAME}. A university project built
          with Next.js.
        </p>
      </div>
    </footer>
  );
}
