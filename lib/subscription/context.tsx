"use client";

import { createContext, useContext } from "react";
import { SubscriptionState } from "./types";

export interface SubscriptionContextType extends SubscriptionState {
  useGetSubscription: () => Promise<void>;
  useGetSubscriptionManage: () => Promise<{ url: string } | undefined>;
  useCreateSubscription: (planId: string) => Promise<{ url: string } | undefined>;
  useUpdateSubscription: (planId: string) => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within SubscriptionProvider");
  }
  return context;
};
