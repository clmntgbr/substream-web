import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoQueueFilterResetProps {
  onReset: () => void;
}

export function VideoQueueFilterReset({ onReset }: VideoQueueFilterResetProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onReset}>
      Reset Filters
      <X />
    </Button>
  );
}
