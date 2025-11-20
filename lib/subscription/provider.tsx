"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getSubscription } from "./api";
import { SubscriptionContext } from "./context";
import { SubscriptionReducer } from "./reducer";
import { SubscriptionState } from "./types";

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
};

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  useEffect(() => {
    useGetSubscription();
  }, [useGetSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        useGetSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
