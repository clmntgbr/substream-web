"use client";

import { apiClient } from "@/lib/api-client";
import * as React from "react";
import { createContext, useCallback, useContext, useReducer } from "react";
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
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to get plans",
        });
        toast.error("Search failed", {
          description: "Failed to get plans",
        });
      }
    } catch (error: unknown) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to get plans",
      });
      toast.error("Search failed", {
        description: "Failed to get plans",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

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
