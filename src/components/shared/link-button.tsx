import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type Props = Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: string;
};

export function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button nativeButton={false} render={<Link href={href} />} {...props}>
      {children}
    </Button>
  );
}
