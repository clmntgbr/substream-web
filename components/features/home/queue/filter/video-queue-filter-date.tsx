import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/lib/use-translations";
import { ChevronDownIcon } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

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
  const translations = useTranslations();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const handleFromDateChange = useCallback(
    (date: Date | undefined) => {
      setFromDate(date);
      onDateChange(date, toDate);
    },
    [onDateChange, toDate]
  );

  const handleToDateChange = useCallback(
    (date: Date | undefined) => {
      setToDate(date);
      onDateChange(fromDate, date);
    },
    [onDateChange, fromDate]
  );

  const reset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateChange(undefined, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove onDateChange dependency to avoid re-creation

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset]
  );

  return (
    <div className="flex gap-4">
      <ButtonGroup>
        <div className="flex flex-col gap-3">
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
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
          <Popover open={toOpen} onOpenChange={setToOpen}>
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
  );
});
