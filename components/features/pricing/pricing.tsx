"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plan } from "@/lib/plan/types";
import { useSubscriptions } from "@/lib/subscription/context";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";

interface PricingProps {
  plans: Plan[];
  currentPlan?: Plan | null;
}

export const Pricing = ({ plans, currentPlan }: PricingProps) => {
  const [frequency, setFrequency] = useState<string>("monthly");
  const { useCreateSubscription } = useSubscriptions();

  const filteredPlans = plans.filter((plan) => (frequency === "monthly" ? plan.isMonthly : plan.isYearly));

  const handleCreateSubscription = async (plan: Plan) => {
    await useCreateSubscription(plan.id);
  };

  return (
    <div className="not-prose flex flex-col text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">Simple, transparent pricing</h1>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground">
          Managing a business is hard enough, so why not make your life easier? Our pricing plans are simple, transparent and scale with you.
        </p>
        <Tabs defaultValue={frequency} onValueChange={setFrequency} className="my-14">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary">20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid gap-4 lg:grid-cols-4">
          {filteredPlans.map((plan) => (
            <Card className={cn("relative w-full flex flex-col", plan.isPopular && "ring-2 ring-primary")} key={plan.name ?? plan.id}>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 flex gap-2">
                {plan.isPopular && <Badge className="rounded-full">Popular</Badge>}
                {plan.id === currentPlan?.id && <Badge className="rounded-full">Current</Badge>}
              </div>
              <CardHeader className="flex flex-col flex-1">
                <CardTitle className="font-medium text-xl">{plan.name}</CardTitle>

                <p className="flex-1 text-sm text-muted-foreground text-left">{plan.description}</p>
              </CardHeader>

              <CardDescription className="flex flex-col px-6 items-center justify-center">
                {plan.price !== undefined && (
                  <NumberFlow
                    className="font-medium text-foreground"
                    format={{
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 2,
                    }}
                    suffix={frequency === "yearly" ? "/month, billed yearly." : "/month, billed monthly."}
                    value={frequency === "yearly" ? plan.price / 12 : plan.price}
                  />
                )}
              </CardDescription>

              <CardContent className="grid gap-2">
                {plan.features?.map((feature, index) => (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm" key={index}>
                    <BadgeCheck className="h-4 w-4" />
                    {feature}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default" disabled={plan.id === currentPlan?.id} onClick={() => handleCreateSubscription(plan)}>
                  {plan.reference}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
