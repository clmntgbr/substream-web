"use client";
import { useAuth } from "@/lib/auth-context";

const BillingPage = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <h1>Billing</h1>
    </div>
  );
};

export default BillingPage;
