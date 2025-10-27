import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/lib/use-translations";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export const VideoQueueFilterDate = () => {
  const translations = useTranslations();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  return (
    <div className="flex gap-4">
      <ButtonGroup>
        <div className="flex flex-col gap-3">
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal rounded-r-none">
                {fromDate ? fromDate.toLocaleDateString() : translations.home.queue.filterDate.from}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setFromDate(date);
                  setFromOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal rounded-r-none">
                {toDate ? toDate.toLocaleDateString() : translations.home.queue.filterDate.to}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setToDate(date);
                  setToOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </ButtonGroup>
    </div>
  );
};
