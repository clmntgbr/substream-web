"use client";

import { createContext, useContext } from "react";
import { StreamState } from "./types";

export interface StreamContextType extends StreamState {
  useFetchStreams: () => Promise<void>;
  clearStream: () => void;
}

export const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within StreamProvider");
  }
  return context;
};
