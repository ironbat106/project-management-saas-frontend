import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Logo />
        </div>
      </header>
      <main
        id="main"
        className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12"
      >
        {children}
      </main>
    </div>
  );
}
