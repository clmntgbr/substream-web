import { PlanAction, PlanState } from "./types";

export const planReducer = (
  state: PlanState,
  action: PlanAction
): PlanState => {
  switch (action.type) {
    case "FETCH_PLANS_SUCCESS":
      return {
        ...state,
        plans: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_PLANS_ERROR":
      return {
        ...state,
        plans: [],
        loading: false,
        error: action.payload,
      };
    case "GET_PLAN_SUCCESS":
      return {
        ...state,
        plan: action.payload,
        loading: false,
        error: null,
      };
    case "GET_PLAN_ERROR":
      return {
        ...state,
        plan: null,
        loading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "CLEAR_PLANS":
      return {
        ...state,
        plans: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
