"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Billing & Subscription
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* {activeSubscription && (
          <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <CardTitle>Current Plan</CardTitle>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeSubscription.plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{activeSubscription.plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{formatPrice(activeSubscription.plan.price * 100)}</span>
                    <span className="text-sm text-muted-foreground">/{activeSubscription.plan.interval}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Renews on</p>
                      <p className="text-sm font-medium">{formatDate(activeSubscription.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Auto-renewal</p>
                      <p className="text-sm font-medium">{activeSubscription.isAutoRenew ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white">Plan Limits</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeSubscription.plan.maxVideosPerMonth}</p>
                    <p className="text-xs text-muted-foreground">Videos/Month</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(activeSubscription.plan.maxSizeInMegabytes / 1000)}GB
                    </p>
                    <p className="text-xs text-muted-foreground">Max Size</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeSubscription.plan.maxDurationMinutes}m</p>
                    <p className="text-xs text-muted-foreground">Max Duration</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button size="sm" variant="outline">
                  Upgrade Plan
                </Button>
                <Button size="sm" variant="ghost">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3">
            If you have any questions about your subscription or billing, our
            support team is here to help.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
