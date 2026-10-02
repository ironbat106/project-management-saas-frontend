import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const PATHS = [
  "",
  "/services",
  "/pricing",
  "/about",
  "/faq",
  "/contact",
  "/login",
  "/register",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${SITE_URL}${path}` }));
}
