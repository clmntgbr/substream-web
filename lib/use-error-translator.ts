"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "./use-translations";

export interface BackendErrorPayload {
  key?: string | null;
  message?: string | null;
  error?: string | null;
  params?: Record<string, unknown> | null;
}

const FALLBACK_ERROR_MESSAGE =
  "An unexpected error occurred. Please try again later.";

const sanitizeParams = (params?: Record<string, unknown> | null) => {
  if (!params || typeof params !== "object") {
    return undefined;
  }

  return Object.entries(params).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        acc[key] = "";
        return acc;
      }

      if (typeof value === "string") {
        acc[key] = value;
        return acc;
      }

      try {
        acc[key] = JSON.stringify(value);
      } catch {
        acc[key] = String(value);
      }

      return acc;
    },
    {},
  );
};

export function useErrorTranslator() {
  const translations = useTranslations();

  const errorsDictionary = useMemo(() => {
    const dictionary = translations.errors;
    if (dictionary && typeof dictionary === "object") {
      return dictionary as Record<string, string>;
    }
    return {} as Record<string, string>;
  }, [translations]);

  const defaultErrorMessage = useMemo(() => {
    return errorsDictionary.default || FALLBACK_ERROR_MESSAGE;
  }, [errorsDictionary]);

  const translateError = useCallback(
    (
      key?: string | null,
      params?: Record<string, unknown> | null,
      fallback?: string | null,
    ) => {
      if (!key) {
        return fallback ?? null;
      }

      const template = errorsDictionary[key];

      if (!template) {
        return fallback ?? null;
      }

      const sanitizedParams = sanitizeParams(params);

      if (!sanitizedParams) {
        return template;
      }

      return Object.entries(sanitizedParams).reduce(
        (message, [paramKey, paramValue]) => {
          return message.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            paramValue,
          );
        },
        template,
      );
    },
    [errorsDictionary],
  );

  const resolveErrorMessage = useCallback(
    (error?: BackendErrorPayload | null, fallback?: string | null) => {
      if (!error) {
        return fallback ?? defaultErrorMessage;
      }

      const translated = translateError(
        error.key,
        error.params ?? undefined,
        null,
      );
      if (translated) {
        return translated;
      }

      const messageCandidates = [
        error.message,
        error.error,
        fallback,
        defaultErrorMessage,
      ];
      const resolved = messageCandidates.find(
        (candidate): candidate is string =>
          typeof candidate === "string" && candidate.trim().length > 0,
      );

      return resolved || defaultErrorMessage;
    },
    [defaultErrorMessage, translateError],
  );

  const parseErrorPayload = useCallback(
    (data: unknown): BackendErrorPayload => {
      if (!data || typeof data !== "object") {
        return {};
      }

      const record = data as Record<string, unknown>;

      return {
        key: typeof record.key === "string" ? record.key : undefined,
        message:
          typeof record.message === "string" ? record.message : undefined,
        error: typeof record.error === "string" ? record.error : undefined,
        params:
          record.params &&
          typeof record.params === "object" &&
          record.params !== null
            ? (record.params as Record<string, unknown>)
            : undefined,
      };
    },
    [],
  );

  return {
    translateError,
    resolveErrorMessage,
    parseErrorPayload,
    getDefaultErrorMessage: () => defaultErrorMessage,
  } as const;
}
