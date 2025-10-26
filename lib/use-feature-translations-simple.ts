"use client";

import { useParams } from "next/navigation";
import type { Locale } from "./dictionaries";

// Import des traductions unifiées
import featuresEn from "@/dictionaries/en.json";
import featuresFr from "@/dictionaries/fr.json";

const featureDictionaries = {
  en: featuresEn,
  fr: featuresFr,
};

export function useFeatureTranslations(feature: "auth" | "home" | "shared" | "layout") {
  const params = useParams();
  const locale = (params?.lang as Locale) || "en";

  const translations = featureDictionaries[locale] || featureDictionaries.en;
  return translations[feature] as any;
}
