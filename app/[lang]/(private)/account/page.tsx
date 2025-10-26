"use client";
import { useAuth } from "@/lib/auth-context";

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <h1>Account</h1>
    </div>
  );
};

export default AccountPage;
