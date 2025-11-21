export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isAutoRenew: boolean;
  isActive: boolean;
  isExpired: boolean;
  isCanceled: boolean;
  isPaidSubscription: boolean;
  isFreeSubscription: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

export interface CreateSubscriptionRequestBody {
  planId: string;
}

export interface GetSubscriptionPreviewRequestBody {
  planId: string;
}

export interface UpdateSubscriptionRequestBody {
  planId: string;
}

export interface GetSubscriptionUpdatePreviewResponse {
  amountDue: number;
  credit: number;
  debit: number;
  currency: string;
  nextBillingDate: string;
}

export type SubscriptionAction =
  | { type: "GET_SUBSCRIPTION_SUCCESS"; payload: Subscription }
  | { type: "GET_SUBSCRIPTION_ERROR"; payload: string }
  | { type: "GET_SUBSCRIPTION_MANAGE_ERROR"; payload: string }
  | { type: "CREATE_SUBSCRIPTION_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
