export const SITE_NAME = "Workline";

export const SITE_DESCRIPTION =
  "Workline is a project management workspace for teams that ship in sprints. Organize teams, projects, sprints and tasks with role based access and Stripe billing.";

export const ACCESS_COOKIE = "wl_access";
export const REFRESH_COOKIE = "wl_refresh";
export const ORG_COOKIE = "wl_org";

export const ROLE_HOME = {
  ADMIN: "/admin",
  OWNER: "/owner",
  MEMBER: "/member",
} as const;

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    description: "Start with every core feature at no cost.",
  },
  {
    id: "PRO",
    name: "Pro",
    price: 19,
    description: "For teams that want a paid workspace.",
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: 49,
    description: "For larger organizations with several teams.",
  },
] as const;

export const PLAN_INTERVAL = "month";
