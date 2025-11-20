"use client";

import { Pricing } from "@/components/features/pricing/pricing";
import { usePlans } from "@/lib/plan/context";

export default function PricingPage() {
  const { plans, plan } = usePlans();
  return (
    <>
      <Pricing plans={plans} currentPlan={plan} />
    </>
  );
}
