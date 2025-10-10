"use client";

import { useParams } from "next/navigation";
import type { Locale } from "./dictionaries";

// Client-side dictionaries (imported statically)
import enDict from "@/dictionaries/en.json";
import frDict from "@/dictionaries/fr.json";

const dictionaries = {
  en: enDict,
  fr: frDict,
};

export function useTranslations() {
  const params = useParams();
  const locale = (params?.lang as Locale) || "en";

  return dictionaries[locale];
}
