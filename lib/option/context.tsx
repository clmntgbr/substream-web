"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Option } from "./types";

// Context type
interface OptionContextType {
  isLoading: boolean;
  error: string | null;
  createOption: (optionData: Partial<Option>) => Promise<Option | null>;
}

// Create context
const OptionContext = createContext<OptionContextType | undefined>(undefined);

// Provider component
export function OptionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create option
  const createOption = useCallback(async (optionData: Partial<Option>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(optionData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.option;
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create option");
        return null;
      }
    } catch (error) {
      setError("Failed to create option");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <OptionContext.Provider
      value={{
        isLoading,
        error,
        createOption,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
}

// Custom hook to use the option context
export function useOptions() {
  const context = useContext(OptionContext);
  if (context === undefined) {
    throw new Error("useOptions must be used within an OptionProvider");
  }
  return context;
}
