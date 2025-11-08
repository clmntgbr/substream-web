export interface Plan {
  id?: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  maxVideosPerMonth: number;
  maxSizeInMegabytes: number;
  maxDurationMinutes: number;
  features: string[];
}

export interface PlanState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

export type PlanAction =
  | { type: "SET_PLANS"; payload: Plan[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };
