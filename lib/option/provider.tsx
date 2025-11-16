"use client";

import { useCallback, useReducer } from "react";
import { createOption } from "./api";
import { OptionContext } from "./context";
import { optionReducer } from "./reducer";
import { Option, OptionState } from "./types";

const initialState: OptionState = {
  option: null,
  loading: false,
  error: null,
};

export function OptionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(optionReducer, initialState);

  const useCreateOption = useCallback(async (optionData: Partial<Option>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const option = await createOption(optionData);
      if (!option || !option.id) {
        throw new Error("Failed to create option");
      }
      return option;
    } catch (error) {
      throw new Error("Failed to create option");
    }
  }, []);

  return (
    <OptionContext.Provider
      value={{
        ...state,
        useCreateOption,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
}
