export interface Plan {
  id?: string;
  isPopular?: boolean;
  name: string;
  description: string;
  reference: string;
  price: number;
  interval: string;
  features: string[];
  maxVideosPerMonth: number;
  maxSizeInMegabytes: number;
  maxDurationMinutes: number;
  isYearly: boolean;
  isMonthly: boolean;
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
