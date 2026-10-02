import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 font-semibold">
      <Image src="/logo.svg" alt="" width={28} height={28} priority />
      <span className="text-base tracking-tight">{SITE_NAME}</span>
    </Link>
  );
}
