"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/lib/plan/context";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";

const Pricing = () => {
  const { plans, plan } = usePlans();

  const [frequency, setFrequency] = useState<string>("monthly");

  return (
    <div className="not-prose flex flex-col gap-16 text-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="mb-0 font-medium text-5xl tracking-tighter!">
          Simple, transparent pricing
        </h1>
        <Tabs defaultValue={frequency} onValueChange={setFrequency}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary">20% off</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {plans.map(
                (planListItem) =>
                  planListItem.isMonthly && (
                    <Card
                      className={cn(
                        "relative w-full text-left flex flex-col",
                        planListItem.isPopular && "ring-2 ring-primary"
                      )}
                      key={planListItem.id}
                    >
                      {planListItem.isPopular && (
                        <Badge className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full">
                          Popular
                        </Badge>
                      )}
                      <CardHeader className="flex flex-col flex-1">
                        <CardTitle className="font-medium text-xl">
                          {planListItem.name}
                        </CardTitle>
                        <CardDescription className="flex flex-col flex-1">
                          <p className="flex-1">{planListItem.description}</p>
                          {planListItem.price && (
                            <NumberFlow
                              className="font-medium text-foreground mt-2"
                              format={{
                                style: "currency",
                                currency: "EUR",
                                maximumFractionDigits: 2,
                              }}
                              suffix={`/month, billed monthly.`}
                              value={planListItem.price}
                            />
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-2 flex-1">
                        {planListItem.features?.map((feature, index) => (
                          <div
                            className="flex items-center gap-2 text-muted-foreground text-sm"
                            key={index}
                          >
                            <BadgeCheck className="h-4 w-4" />
                            {feature}
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={"default"}
                          disabled={planListItem.id === plan?.id}
                        >
                          {planListItem.reference}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  )
              )}
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {plans.map(
                (planListItem) =>
                  planListItem.isYearly && (
                    <Card
                      className={cn(
                        "relative w-full text-left flex flex-col",
                        planListItem.isPopular && "ring-2 ring-primary"
                      )}
                      key={planListItem.id}
                    >
                      {planListItem.isPopular && (
                        <Badge className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full">
                          Popular
                        </Badge>
                      )}
                      <CardHeader className="flex flex-col flex-1">
                        <CardTitle className="font-medium text-xl">
                          {planListItem.name}
                        </CardTitle>
                        <CardDescription className="flex flex-col flex-1">
                          <p className="flex-1">{planListItem.description}</p>
                          {planListItem.price && (
                            <NumberFlow
                              className="font-medium text-foreground"
                              format={{
                                style: "currency",
                                currency: "EUR",
                                maximumFractionDigits: 2,
                              }}
                              suffix={`/month, billed yearly.`}
                              value={planListItem.price / 12}
                            />
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-2 flex-1">
                        {planListItem.features?.map((feature, index) => (
                          <div
                            className="flex items-center gap-2 text-muted-foreground text-sm"
                            key={index}
                          >
                            <BadgeCheck className="h-4 w-4" />
                            {feature}
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={"default"}
                          disabled={planListItem.id === plan?.id}
                        >
                          {planListItem.reference}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Pricing;
