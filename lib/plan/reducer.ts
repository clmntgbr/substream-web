import { PlanAction, PlanState } from "./types";

// Initial state
export const initialState: PlanState = {
  plans: [],
  isLoading: false,
  error: null,
};

// Reducer function
export function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "SET_PLANS":
      return {
        ...state,
        plans: action.payload,
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
