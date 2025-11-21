"use client";

import PricingPreview from "@/components/features/pricing/preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/lib/plan/context";
import { Plan } from "@/lib/plan/types";
import { useSubscriptions } from "@/lib/subscription/context";
import { GetSubscriptionUpdatePreviewResponse } from "@/lib/subscription/types";
import NumberFlow from "@number-flow/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { subscription, useGetSubscriptionManage, useCreateSubscription, useUpdateSubscription, useGetSubscriptionUpdatePreview } =
    useSubscriptions();
  const { plans, plan: currentPlan } = usePlans();

  const [frequency, setFrequency] = useState<string>("monthly");
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptionPreview, setSubscriptionPreview] = useState<GetSubscriptionUpdatePreviewResponse | null>(null);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const filteredPlans = plans.filter((plan) => (frequency === "monthly" ? plan.isMonthly : plan.isYearly));

  const handleCreateSubscription = async (plan: Plan) => {
    setLoadingButton(`create-${plan.id}`);
    try {
      const result = await useCreateSubscription(plan.id);
      if (!result) return;
      router.push(result.url);
    } finally {
      setLoadingButton(null);
    }
  };

  const handleGetSubscriptionManage = async () => {
    setLoadingButton("manage");
    try {
      const result = await useGetSubscriptionManage();
      if (!result) return;
      router.push(result.url);
    } finally {
      setLoadingButton(null);
    }
  };

  const handleGetSubscriptionUpdatePreview = async (plan: Plan) => {
    setLoadingButton(`preview-${plan.id}`);
    try {
      const result = await useGetSubscriptionUpdatePreview(plan.id);
      if (!result) return;

      setSubscriptionPreview(result);
      setSelectedPlan(plan);
      setOpen(true);
    } finally {
      setLoadingButton(null);
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedPlan) return;
    await useUpdateSubscription(selectedPlan.id);
    setOpen(false);
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
                <Button className="w-full" variant="default" onClick={handleGetSubscriptionManage} disabled={loadingButton !== null}>
                  Manage your subscription
                  {loadingButton === "manage" ? <Spinner className="ml-2 size-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
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
                  onClick={() => (subscription?.isFreeSubscription ? handleCreateSubscription(plan) : handleGetSubscriptionUpdatePreview(plan))}
                  disabled={loadingButton !== null}
                >
                  Update to {plan.reference}
                  {loadingButton === `create-${plan.id}` || loadingButton === `preview-${plan.id}` ? (
                    <Spinner className="ml-2 size-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
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

      {subscriptionPreview && (
        <PricingPreview
          subscriptionPreview={subscriptionPreview}
          onUpdateSubscription={handleUpdateSubscription}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
