"use client";

import { createContext, useContext } from "react";
import { SubscriptionState } from "./types";

export interface SubscriptionContextType extends SubscriptionState {
  useGetSubscription: () => Promise<void>;
  useGetSubscriptionManage: () => Promise<{ url: string }>;
  useCreateSubscription: (planId: string) => Promise<{ url: string }>;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within SubscriptionProvider");
  }
  return context;
};
