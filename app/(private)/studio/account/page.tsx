"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/lib/plan/context";
import { Plan } from "@/lib/plan/types";
import { useSubscriptions } from "@/lib/subscription/context";
import NumberFlow from "@number-flow/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { subscription, useGetSubscriptionManage, useCreateSubscription, useUpdateSubscription } = useSubscriptions();
  const { plans, plan: currentPlan } = usePlans();

  const [frequency, setFrequency] = useState<string>("monthly");

  const filteredPlans = plans.filter((plan) => (frequency === "monthly" ? plan.isMonthly : plan.isYearly));

  const handleCreateSubscription = async (plan: Plan) => {
    const result = await useCreateSubscription(plan.id);
    if (!result) return;
    router.push(result.url);
  };

  const handleGetSubscriptionManage = async () => {
    const result = await useGetSubscriptionManage();
    if (!result) return;
    router.push(result.url);
  };

  const handleUpdateSubscription = async (plan: Plan) => {
    await useUpdateSubscription(plan.id);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Subscription</h1>
        <p className="text-lg text-muted-foreground">Manage your subscription information</p>
      </div>

      {currentPlan && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-2 my-8">
          <Card className="relative w-full flex flex-col" key={currentPlan.name ?? currentPlan.id}>
            <CardHeader className="flex flex-col flex-1">
              <CardTitle className="font-medium text-xl">
                {currentPlan.name}
                {currentPlan.price !== undefined && (
                  <NumberFlow
                    className="font-medium text-xs text-muted-foreground ml-4"
                    format={{
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 2,
                    }}
                    suffix={currentPlan.interval === "both" ? "" : currentPlan.interval === "yearly" ? "/billed yearly" : "/billed monthly"}
                    value={frequency === "yearly" ? currentPlan.price / 12 : currentPlan.price}
                  />
                )}
              </CardTitle>

              <p className="flex-1 text-sm text-muted-foreground text-left">{currentPlan.description}</p>
            </CardHeader>

            {currentPlan.reference !== "plan_free" && (
              <CardFooter>
                <Button className="w-full" variant="default" onClick={handleGetSubscriptionManage}>
                  Manage your subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white my-8">Update to a plan</h3>

      <Tabs defaultValue={frequency} onValueChange={setFrequency} className="mb-2">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">
            Yearly
            <Badge variant="secondary">20% off</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {filteredPlans.map((plan) => {
          if (plan.id === currentPlan?.id) return null;
          if (plan.reference === "plan_free") return null;
          return (
            <Card className="relative w-full flex flex-col" key={plan.name ?? plan.id}>
              <CardHeader className="flex flex-col flex-1">
                <CardTitle className="font-medium text-xl">
                  {plan.name}
                  {plan.price !== undefined && (
                    <NumberFlow
                      className="font-medium text-xs text-muted-foreground ml-4"
                      format={{
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 2,
                      }}
                      suffix={frequency === "yearly" ? "/month, billed yearly" : "/month, billed monthly"}
                      value={frequency === "yearly" ? plan.price / 12 : plan.price}
                    />
                  )}
                </CardTitle>

                <p className="flex-1 text-sm text-muted-foreground text-left">{plan.description}</p>
              </CardHeader>

              <CardFooter>
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => (subscription?.isFreeSubscription ? handleCreateSubscription(plan) : handleUpdateSubscription(plan))}
                >
                  Update to {plan.reference}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3">If you have any questions about your subscription or billing, our support team is here to help.</p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
