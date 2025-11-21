"use client";

import { useCallback, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { createSubsription, getSubscription, getSubscriptionManage, getSubscriptionUpdatePreview, updateSubsription } from "./api";
import { SubscriptionContext } from "./context";
import { SubscriptionReducer } from "./reducer";
import { GetSubscriptionUpdatePreviewResponse, SubscriptionState } from "./types";

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(SubscriptionReducer, initialState);

  const useGetSubscription = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const subscription = await getSubscription();

      dispatch({ type: "GET_SUBSCRIPTION_SUCCESS", payload: subscription });
    } catch (error) {
      dispatch({
        type: "GET_SUBSCRIPTION_ERROR",
        payload: "Failed to get subscription",
      });
    }
  }, []);

  const useGetSubscriptionManage = useCallback(async (): Promise<{ url: string } | undefined> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await getSubscriptionManage();

      if (!response.url) {
        throw new Error();
      }

      return { url: response.url };
    } catch (error) {
      toast.error("Failed to get subscription manage");
    }
  }, []);

  const useCreateSubscription = useCallback(async (planId: string): Promise<{ url: string } | undefined> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await createSubsription({ planId: planId });

      if (!response.url) {
        throw new Error();
      }

      return { url: response.url };
    } catch (error) {
      toast.error("Failed to create subscription");
    }
  }, []);

  const useGetSubscriptionUpdatePreview = useCallback(async (planId: string): Promise<GetSubscriptionUpdatePreviewResponse | undefined> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await getSubscriptionUpdatePreview({ planId: planId });

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      toast.error("Failed to get subscription update preview");
    }
  }, []);

  const useUpdateSubscription = useCallback(async (planId: string): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await updateSubsription({ planId: planId });
      toast.success("Subscription updated successfully");
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  }, []);

  useEffect(() => {
    useGetSubscription();
  }, [useGetSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        useGetSubscription,
        useGetSubscriptionManage,
        useCreateSubscription,
        useUpdateSubscription,
        useGetSubscriptionUpdatePreview,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
