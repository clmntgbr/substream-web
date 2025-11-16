import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { memo, useState } from "react";

interface VideoQueueFilterDateProps {
  onDateChange: (from: Date | undefined, to: Date | undefined) => void;
}

const VideoQueueFilterDateComponent = function VideoQueueFilterDate({ onDateChange }: VideoQueueFilterDateProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  const handleFromChange = (date: Date | undefined) => {
    setFrom(date);
    setFromOpen(false);
    onDateChange(date, to);
  };

  const handleToChange = (date: Date | undefined) => {
    setTo(date);
    setToOpen(false);
    onDateChange(from, date);
  };

  return (
    <div>
      <div className="flex gap-4">
        <ButtonGroup>
          <div className="flex flex-col gap-3">
            <Popover open={fromOpen} onOpenChange={setFromOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date-picker-from" className="w-32 justify-between font-normal rounded-r-none">
                  {from ? from.toLocaleDateString() : "From"}
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
                  {to ? to.toLocaleDateString() : "To"}
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
    </div>
  );
};

export const VideoQueueFilterDate = memo(VideoQueueFilterDateComponent);
