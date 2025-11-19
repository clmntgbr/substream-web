import { Hydra } from "../hydra";

export interface Plan {
  id?: string;
}

export interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}

export type PlanAction =
  | { type: "FETCH_PLANS_SUCCESS"; payload: Plan[] }
  | { type: "FETCH_PLANS_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_PLANS" };
