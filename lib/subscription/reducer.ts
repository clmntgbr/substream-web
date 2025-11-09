import { SubscriptionAction, SubscriptionState } from "./types";

// Initial state
export const initialState: SubscriptionState = {
  subscription: null,
  subscriptions: [],
  isLoading: false,
  error: null,
};

// Reducer function
export function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case "SET_SUBSCRIPTION":
      return {
        ...state,
        subscription: action.payload,
        error: null,
      };
    case "SET_SUBSCRIPTIONS":
      return {
        ...state,
        subscriptions: action.payload,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
