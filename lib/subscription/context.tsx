"use client";

import { apiClient } from "@/lib/api-client";
import { useGetTranslation } from "@/lib/use-get-translation";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, subscriptionReducer } from "./reducer";
import { Subscription } from "./types";

interface SubscriptionContextType {
  getSubscribe: (planId: string) => Promise<void>;
  getSubscriptions: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const getTranslation = useGetTranslation();

  const getSubscribe = useCallback(
    async (planId: string) => {
      try {
        const response = await apiClient.get(`/api/subscribe?planId=${encodeURIComponent(planId)}`);

        if (response.ok) {
          const data = (await response.json()) as {
            url: string;
          };

          router.push(data.url);
        } else {
          toast.error(getTranslation("error.subscription.failed_to_get_subscribe"));
        }
      } catch {
        toast.error(getTranslation("error.subscription.failed_to_get_subscribe"));
      }
    },
    [getTranslation]
  );

  const getSubscriptions = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await apiClient.get(`/api/subscriptions`);

      if (response.ok) {
        const data = (await response.json()) as {
          subscriptions: Subscription[];
        };

        dispatch({
          type: "SET_SUBSCRIPTIONS",
          payload: data.subscriptions || [],
        });
      } else {
        const message = getTranslation("error.subscription.failed_to_get_subscriptions");
        dispatch({
          type: "SET_ERROR",
          payload: message,
        });
        toast.error(getTranslation("error.subscription.failed_to_get_subscriptions"), {
          description: message,
        });
      }
    } catch {
      const message = getTranslation("error.subscription.failed_to_get_subscriptions");
      dispatch({
        type: "SET_ERROR",
        payload: message,
      });
      toast.error(getTranslation("error.subscription.failed_to_get_subscriptions"), {
        description: message,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getTranslation]);

  useEffect(() => {
    getSubscriptions();
  }, [getSubscriptions]);

  return (
    <SubscriptionContext.Provider
      value={{
        getSubscribe,
        getSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
