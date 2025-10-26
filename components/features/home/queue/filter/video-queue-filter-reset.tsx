import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/use-translations";
import { X } from "lucide-react";

interface VideoQueueFilterResetProps {
  handleClearFilters: () => void;
}

export function VideoQueueFilterReset({ handleClearFilters }: VideoQueueFilterResetProps) {
  const t = useTranslations();
  return (
    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
      {t?.home?.queue?.resetFilters || "Reset Filters"}
      <X />
    </Button>
  );
}
