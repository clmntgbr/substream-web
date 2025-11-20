export interface Subscription {
  id: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

export type SubscriptionAction =
  | { type: "GET_SUBSCRIPTION_SUCCESS"; payload: Subscription }
  | { type: "GET_SUBSCRIPTION_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
