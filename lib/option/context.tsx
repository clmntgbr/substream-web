"use client";

import { useErrorTranslator } from "@/lib/use-error-translator";
import { createContext, useCallback, useContext, useState } from "react";
import { Option } from "./types";

interface OptionContextType {
  isLoading: boolean;
  error: string | null;
  createOption: (optionData: Partial<Option>) => Promise<Option | null>;
}

const OptionContext = createContext<OptionContextType | undefined>(undefined);

export function OptionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resolveErrorMessage, parseErrorPayload, getDefaultErrorMessage } =
    useErrorTranslator();

  const resolveFromResponse = useCallback(
    (data: unknown, fallback: string) => {
      const parsed = parseErrorPayload(data);
      const record =
        data && typeof data === "object" && data !== null
          ? (data as Record<string, unknown>)
          : {};

      return resolveErrorMessage(
        {
          ...parsed,
          message:
            parsed.message ??
            (typeof record.message === "string"
              ? (record.message as string)
              : undefined),
          error:
            parsed.error ??
            (typeof record.error === "string"
              ? (record.error as string)
              : undefined),
          params:
            parsed.params ??
            (record.params && typeof record.params === "object"
              ? (record.params as Record<string, unknown>)
              : undefined),
        },
        fallback,
      );
    },
    [parseErrorPayload, resolveErrorMessage],
  );

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
        const data = (await response.json()) as { option: Option };
        return data.option;
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = resolveFromResponse(
          errorData,
          "Failed to create option",
        );
        setError(message);
        return null;
      }
    } catch (err) {
      const backendError = err as
        | (Error & { key?: string; params?: Record<string, unknown> })
        | undefined;
      const message = resolveErrorMessage(
        {
          key: backendError?.key,
          params: backendError?.params,
          message:
            backendError instanceof Error ? backendError.message : undefined,
        },
        backendError instanceof Error
          ? backendError.message
          : getDefaultErrorMessage(),
      );
      setError(message);
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
