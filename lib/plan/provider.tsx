"use client";

import { useCallback, useEffect, useReducer } from "react";
import { fetchPlans, getPlan } from "./api";
import { PlanContext } from "./context";
import { planReducer } from "./reducer";
import { PlanState } from "./types";

const initialState: PlanState = {
  plans: [],
  plan: null,
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

  const useGetPlan = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const plan = await getPlan();

      dispatch({ type: "GET_PLAN_SUCCESS", payload: plan });
    } catch (error) {
      dispatch({
        type: "GET_PLAN_ERROR",
        payload: "Failed to fetch plans",
      });
    }
  }, []);

  useEffect(() => {
    useFetchPlans();
    useGetPlan();
  }, [useFetchPlans, useGetPlan]);

  return (
    <PlanContext.Provider
      value={{
        ...state,
        useGetPlan,
        useFetchPlans,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}
