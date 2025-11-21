"use client";

import { useCallback, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { createSubsription, getSubscription, getSubscriptionManage } from "./api";
import { SubscriptionContext } from "./context";
import { SubscriptionReducer } from "./reducer";
import { SubscriptionState } from "./types";

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

  const useGetSubscriptionManage = useCallback(async (): Promise<{ url: string }> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await getSubscriptionManage();

      if (!response.url) {
        toast.error("Failed to create subscription");
        dispatch({
          type: "GET_SUBSCRIPTION_MANAGE_ERROR",
          payload: "Failed to get subscription manage",
        });
        throw new Error("Failed to get subscription manage");
      }

      return { url: response.url };
    } catch (error) {
      toast.error("Failed to get subscription manage");
      dispatch({
        type: "GET_SUBSCRIPTION_MANAGE_ERROR",
        payload: "Failed to get subscription manage",
      });
      throw error;
    }
  }, []);

  const useCreateSubscription = useCallback(async (planId: string): Promise<{ url: string }> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await createSubsription({ planId: planId });

      if (!response.url) {
        toast.error("Failed to create subscription");
        dispatch({
          type: "CREATE_SUBSCRIPTION_ERROR",
          payload: "Failed to create subscription",
        });
        throw new Error("Failed to create subscription");
      }

      return { url: response.url };
    } catch (error) {
      toast.error("Failed to create subscription");
      dispatch({
        type: "CREATE_SUBSCRIPTION_ERROR",
        payload: "Failed to create subscription",
      });
      throw error;
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
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
