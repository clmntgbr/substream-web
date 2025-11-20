import { SubscriptionAction, SubscriptionState } from "./types";

export const SubscriptionReducer = (
  state: SubscriptionState,
  action: SubscriptionAction
): SubscriptionState => {
  switch (action.type) {
    case "GET_SUBSCRIPTION_SUCCESS":
      return {
        ...state,
        subscription: action.payload,
        loading: false,
        error: null,
      };
    case "GET_SUBSCRIPTION_ERROR":
      return {
        ...state,
        subscription: null,
        loading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
