"use client";

import { apiClient } from "@/lib/api-client";
import { useGetTranslation } from "@/lib/use-get-translation";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, planReducer } from "./reducer";
import { Plan, PlanState } from "./types";

interface PlanContextType {
  state: PlanState;
  getPlans: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(planReducer, initialState);
  const getTranslation = useGetTranslation();

  const getPlans = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await apiClient.get(`/api/plans`);

      if (response.ok) {
        const data = (await response.json()) as {
          plans: Plan[];
        };

        dispatch({
          type: "SET_PLANS",
          payload: data.plans || [],
        });
      } else {
        const message = getTranslation("error.plan.failed_to_get_plans");
        dispatch({
          type: "SET_ERROR",
          payload: message,
        });
        toast.error(getTranslation("error.plan.search_failed"), {
          description: message,
        });
      }
    } catch {
      const message = getTranslation("error.plan.failed_to_get_plans");
      dispatch({
        type: "SET_ERROR",
        payload: message,
      });
      toast.error(getTranslation("error.plan.search_failed"), {
        description: message,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getTranslation]);

  // Load plans on component mount
  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <PlanContext.Provider
      value={{
        state,
        getPlans,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlans() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlanProvider");
  }
  return context;
}
