"use client";

import { createContext, useContext } from "react";
import { Option, OptionState } from "./types";

export interface OptionContextType extends OptionState {
  useCreateOption: (optionData: Partial<Option>) => Promise<Option>;
}

export const OptionContext = createContext<OptionContextType | undefined>(undefined);

export const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOption must be used within OptionProvider");
  }
  return context;
};
