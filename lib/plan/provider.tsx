"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  fetchPlans,
} from "./api";
import { PlanContext } from "./context";
import { planReducer } from "./reducer";
import {
  PlanState,
} from "./types";

const initialState: PlanState = {
  plans: [],
  loading: false,
  error: null,
};

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(planReducer, initialState);

  const useFetchPlans = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const plans = await fetchPlans();

      dispatch({ type: "FETCH_PLANS_SUCCESS", payload: plans });
    } catch (error) {
      dispatch({
        type: "FETCH_PLANS_ERROR",
        payload: "Failed to fetch plans",
      });
    }
  }, []);

  useEffect(() => {
    useFetchPlans();
  }, [useFetchPlans]);

  return (
    <PlanContext.Provider
      value={{
        ...state,
        useFetchPlans,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}
