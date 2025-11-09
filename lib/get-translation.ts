// Client-side dictionaries (imported statically)
import enDict from "@/dictionaries/en.json";
import frDict from "@/dictionaries/fr.json";

const dictionaries = {
  en: enDict,
  fr: frDict,
};

export function getTranslation(key: string, fallback?: string): string {
  // Get current language from URL
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const langMatch = currentPath.match(/^\/([a-z]{2})\//);
  const locale = (langMatch ? langMatch[1] : "en") as keyof typeof dictionaries;

  const translations = dictionaries[locale] || dictionaries.en;
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
}
