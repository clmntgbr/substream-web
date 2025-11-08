"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { Plan, usePlans } from "@/lib/plan";
import { useSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Pricing() {
  const { getPlans, state } = usePlans();
  const { getSubscribe } = useSubscription();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const { user } = useAuth();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const currentPlanId = user?.plan?.id;

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  useEffect(() => {
    const filteredPlans = state.plans.filter((plan) => plan.interval === interval || plan.interval === "both");
    setFilteredPlans(filteredPlans);
  }, [state.plans, interval]);

  const handleGetSubscribe = function (planId: string) {
    setLoadingPlanId(planId);
    getSubscribe(planId)
      .then(() => {
        setLoadingPlanId(null);
      })
      .catch(() => {
        setLoadingPlanId(null);
      });
  };
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Choose the plan that works best for you. Upgrade or downgrade at any time.</p>
      </div>

      <div className="mb-12 flex justify-center">
        <Tabs value={interval} onValueChange={(v) => setInterval(v as "monthly" | "yearly")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {filteredPlans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.id;
          const isPopular = plan.name === "Pro";
          const isPlanLoading = loadingPlanId === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn("relative flex flex-col", isCurrentPlan && "border-primary shadow-lg", isPopular && !isCurrentPlan && "border-primary")}
            >
              {isPopular && !isCurrentPlan && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="pb-8 pt-6">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}€</span>
                  <span className="text-muted-foreground">/{interval === "monthly" ? "mo" : "yr"}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                  disabled={isCurrentPlan || isPlanLoading}
                  onClick={() => handleGetSubscribe(plan.id)}
                >
                  {isPlanLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
