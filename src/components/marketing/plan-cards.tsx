import { LinkButton } from "@/components/shared/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLAN_INTERVAL, PLANS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";

export function PlanCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PLANS.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p>
              <span className="text-3xl font-semibold tabular-nums">
                {formatMoney(plan.price)}
              </span>
              {plan.price > 0 ? (
                <span className="text-sm text-muted-foreground">
                  {" "}
                  per {PLAN_INTERVAL}
                </span>
              ) : null}
            </p>
            <LinkButton
              href="/register"
              size="lg"
              variant={plan.id === "PRO" ? "default" : "outline"}
              className="w-full"
            >
              {plan.price === 0 ? "Start for free" : `Start with ${plan.name}`}
            </LinkButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
