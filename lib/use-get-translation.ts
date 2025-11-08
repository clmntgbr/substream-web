"use client";

import { useCallback } from "react";
import { useTranslations } from "./use-translations";

export function useGetTranslation() {
  const translations = useTranslations();

  const getTranslation = useCallback(
    (key: string, fallback?: string): string => {
      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }

      return typeof value === "string" ? value : fallback || key;
    },
    [translations],
  );

  return getTranslation;
}
