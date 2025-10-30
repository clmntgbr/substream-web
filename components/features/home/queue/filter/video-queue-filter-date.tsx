import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { ClientOnly } from "@/components/ui/client-only";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/lib/use-translations";
import { ChevronDownIcon } from "lucide-react";
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface VideoQueueFilterDateProps {
  onDateChange: (from: Date | undefined, to: Date | undefined) => void;
}

export interface VideoQueueFilterDateRef {
  reset: () => void;
}

function getInitialDates() {
  if (typeof window === "undefined") return { from: undefined, to: undefined };
  const params = new URLSearchParams(window.location.search);
  const fromStr = params.get("from");
  const toStr = params.get("to");
  return {
    from: fromStr ? new Date(fromStr) : undefined,
    to: toStr ? new Date(toStr) : undefined,
  };
}

const VideoQueueFilterDateComponent = forwardRef<VideoQueueFilterDateRef, VideoQueueFilterDateProps>(function VideoQueueFilterDate(
  { onDateChange },
  ref
) {
  const translations = useTranslations();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  // To avoid hydration mismatch, initialize as undefined on first client render,
  // then set from/to after mount using window.location.
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const onDateChangeRef = useRef(onDateChange);

  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  useEffect(() => {
    const { from: initFrom, to: initTo } = getInitialDates();
    setFrom(initFrom);
    setTo(initTo);
  }, []);

  const handleFromChange = useCallback(
    (date: Date | undefined) => {
      setFrom(date);
      onDateChangeRef.current(date, to);
      setTimeout(() => setFromOpen(false), 0);
    },
    [to]
  );

  const handleToChange = useCallback(
    (date: Date | undefined) => {
      setTo(date);
      onDateChangeRef.current(from, date);
      setTimeout(() => setToOpen(false), 0);
    },
    [from]
  );

  const reset = useCallback(() => {
    setFrom(undefined);
    setTo(undefined);
    onDateChangeRef.current(undefined, undefined);
  }, []); // Remove onDateChange dependency to avoid re-creation

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset]
  );

  return (
    <ClientOnly
      fallback={
        <div className="flex gap-4">
          <ButtonGroup>
            <div className="flex flex-col gap-3">
              <Button variant="outline" id="date-picker-from" className="w-32 justify-between font-normal rounded-r-none">
                {from ? from.toLocaleDateString() : translations.home.queue.filterDate.from}
                <ChevronDownIcon />
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" id="date-picker-to" className="w-32 justify-between font-normal rounded-r-none">
                {to ? to.toLocaleDateString() : translations.home.queue.filterDate.to}
                <ChevronDownIcon />
              </Button>
            </div>
          </ButtonGroup>
        </div>
      }
    >
      <div className="flex gap-4">
        <ButtonGroup>
          <div className="flex flex-col gap-3">
            <Popover open={fromOpen} onOpenChange={setFromOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date-picker-from" className="w-32 justify-between font-normal rounded-r-none">
                  {from ? from.toLocaleDateString() : translations.home.queue.filterDate.from}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent id="date-picker-from-content" className="w-auto overflow-hidden p-0" align="start">
                <Calendar mode="single" selected={from} captionLayout="dropdown" onSelect={handleFromChange} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3">
            <Popover open={toOpen} onOpenChange={setToOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date-picker-to" className="w-32 justify-between font-normal rounded-r-none">
                  {to ? to.toLocaleDateString() : translations.home.queue.filterDate.to}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent id="date-picker-to-content" className="w-auto overflow-hidden p-0" align="start">
                <Calendar mode="single" selected={to} captionLayout="dropdown" onSelect={handleToChange} />
              </PopoverContent>
            </Popover>
          </div>
        </ButtonGroup>
      </div>
    </ClientOnly>
  );
});

export const VideoQueueFilterDate = memo(VideoQueueFilterDateComponent);
