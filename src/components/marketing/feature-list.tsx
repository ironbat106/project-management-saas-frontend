import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <li key={feature.title} className="space-y-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <feature.icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="font-semibold">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.text}</p>
        </li>
      ))}
    </ul>
  );
}
