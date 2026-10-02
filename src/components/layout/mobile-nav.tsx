"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="icon" className="md:hidden" />}
      >
        <Menu aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Pages and account links</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2 border-t pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border px-3 py-2.5 text-center text-sm font-medium hover:bg-accent"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              Get started
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
