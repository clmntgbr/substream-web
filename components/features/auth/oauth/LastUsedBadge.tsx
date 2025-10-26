import { useFeatureTranslations } from "@/lib/use-feature-translations-simple";

export const LastUsedBadge = () => {
  const t = useFeatureTranslations("auth");

  return (
    <div className="absolute -right-2 -top-1/3">
      <span className="rounded-lg border border-affirmative-primary bg-affirmative px-1.5 py-0.5 text-xs text-affirmative-foreground  dark:text-black/90  bg-[#9aaaf3]">
        {t?.oauth?.lastUsed || "Last used"}
      </span>
    </div>
  );
};
