import { OptionAction, OptionState } from "./types";

export const optionReducer = (state: OptionState, action: OptionAction): OptionState => {
  switch (action.type) {
    case "CREATE_OPTION_SUCCESS":
      return {
        ...state,
        option: action.payload,
        loading: false,
        error: null,
      };
    case "CREATE_OPTION_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
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
