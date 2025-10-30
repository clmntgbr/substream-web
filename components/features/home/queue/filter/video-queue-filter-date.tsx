import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { ClientOnly } from "@/components/ui/client-only";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/lib/use-translations";
import { ChevronDownIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface VideoQueueFilterDateProps {
  onDateChange: (fromDate: Date | undefined, toDate: Date | undefined) => void;
}

export interface VideoQueueFilterDateRef {
  reset: () => void;
}

export const VideoQueueFilterDate = forwardRef<VideoQueueFilterDateRef, VideoQueueFilterDateProps>(function VideoQueueFilterDate(
  { onDateChange },
  ref
) {
  const searchParams = useSearchParams();
  const translations = useTranslations();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);
  const onDateChangeRef = useRef(onDateChange);

  useEffect(() => {
    if (!initialized) {
      const fromDateStr = searchParams.get("fromDate");
      const toDateStr = searchParams.get("toDate");
      if (fromDateStr) {
        setFromDate(new Date(fromDateStr));
      }
      if (toDateStr) {
        setToDate(new Date(toDateStr));
      }
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  const handleFromDateChange = useCallback(
    (date: Date | undefined) => {
      setFromDate(date);
      onDateChangeRef.current(date, toDate);
    },
    [toDate]
  );

  const handleToDateChange = useCallback(
    (date: Date | undefined) => {
      setToDate(date);
      onDateChangeRef.current(fromDate, date);
    },
    [fromDate]
  );

  const reset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
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
                {fromDate ? fromDate.toLocaleDateString() : translations.home.queue.filterDate.from}
                <ChevronDownIcon />
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" id="date-picker-to" className="w-32 justify-between font-normal rounded-r-none">
                {toDate ? toDate.toLocaleDateString() : translations.home.queue.filterDate.to}
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
                  {fromDate ? fromDate.toLocaleDateString() : translations.home.queue.filterDate.from}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent id="date-picker-from-content" className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    handleFromDateChange(date);
                    setFromOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3">
            <Popover open={toOpen} onOpenChange={setToOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date-picker-to" className="w-32 justify-between font-normal rounded-r-none">
                  {toDate ? toDate.toLocaleDateString() : translations.home.queue.filterDate.to}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent id="date-picker-to-content" className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    handleToDateChange(date);
                    setToOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </ButtonGroup>
      </div>
    </ClientOnly>
  );
});
