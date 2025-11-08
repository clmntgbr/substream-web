export interface Subscription {
  endDate: string;
  status: string;
  isAutoRenew: boolean;
  isActive: boolean;
  isExpired: boolean;
  isCanceled: boolean;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

export type SubscriptionAction =
  | { type: "SET_SUBSCRIPTION"; payload: Subscription }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };
