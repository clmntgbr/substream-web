import { useTranslations } from "@/lib/use-translations";

export const LastUsedBadge = () => {
  const t = useTranslations();

  return (
    <div className="absolute -right-2 -top-1/3">
      <span className="rounded-lg border border-affirmative-primary bg-affirmative px-1.5 py-0.5 text-xs text-affirmative-foreground  dark:text-black/90  bg-[#9aaaf3]">
        {t.login.last_used}
      </span>
    </div>
  );
};
