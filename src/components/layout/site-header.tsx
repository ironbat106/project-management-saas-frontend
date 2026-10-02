import { LinkButton } from "@/components/shared/link-button";
import { Logo } from "@/components/shared/logo";
import { MobileNav } from "./mobile-nav";

export const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <LinkButton key={link.href} href={link.href} variant="ghost">
              {link.label}
            </LinkButton>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LinkButton href="/login" variant="outline" size="lg">
            Log in
          </LinkButton>
          <LinkButton href="/register" size="lg">
            Get started
          </LinkButton>
        </div>

        <MobileNav links={PUBLIC_LINKS} />
      </div>
    </header>
  );
}
