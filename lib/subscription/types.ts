import { Plan } from "../plan/types";

export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isAutoRenew: boolean;
  isActive: boolean;
  isExpired: boolean;
  isCanceled: boolean;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
}

export type SubscriptionAction =
  | { type: "SET_SUBSCRIPTION"; payload: Subscription }
  | { type: "SET_SUBSCRIPTIONS"; payload: Subscription[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };
