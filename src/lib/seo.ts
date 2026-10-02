import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

interface Options {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}

export function createMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: Options): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
