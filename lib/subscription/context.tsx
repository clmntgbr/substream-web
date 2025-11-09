"use client";

import { apiClient } from "@/lib/api-client";
import { useGetTranslation } from "@/lib/use-get-translation";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createContext, useCallback, useContext, useReducer } from "react";
import { toast } from "sonner";
import { initialState, subscriptionReducer } from "./reducer";

interface SubscriptionContextType {
  getSubscribe: (planId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const getTranslation = useGetTranslation();

  const getSubscribe = useCallback(
    async (planId: string) => {
      try {
        const response = await apiClient.get(
          `/api/subscribe?planId=${encodeURIComponent(planId)}`,
        );

        if (response.ok) {
          const data = (await response.json()) as {
            url: string;
          };

          router.push(data.url);
        } else {
          toast.error(
            getTranslation("error.subscription.failed_to_get_subscribe"),
          );
        }
      } catch {
        toast.error(
          getTranslation("error.subscription.failed_to_get_subscribe"),
        );
      }
    },
    [getTranslation],
  );

  return (
    <SubscriptionContext.Provider
      value={{
        getSubscribe,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}
