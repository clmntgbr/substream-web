import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, PlusCircle } from "lucide-react";
import { forwardRef, memo, useEffect, useState } from "react";
import { VideoQueueStatuses } from "../video-queue-statuses";

interface VideoQueueFilterStatusProps {
  onStatusChange: (status: string[]) => void;
}

const VideoQueueFilterStatusComponent = forwardRef<
  void,
  VideoQueueFilterStatusProps
>(function VideoQueueFilterStatus({ onStatusChange }, ref) {
  const [selectedStatuses, setSelectedStatuses] = useState<
    string[] | undefined
  >(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSelectStatus = (status: string) => {
    if (selectedStatuses && selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      return;
    }
    setSelectedStatuses([...(selectedStatuses || []), status]);
  };

  useEffect(() => {
    if (selectedStatuses) {
      onStatusChange(selectedStatuses);
    }
  }, [selectedStatuses]);

  return (
    <>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed cursor-pointer hover:bg-accent hover:text-accent-foregroun dark:bg-input"
          >
            <PlusCircle />
            Filter by status
            {selectedStatuses && selectedStatuses.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedStatuses && selectedStatuses.length}
                </Badge>
                <div className="hidden gap-1 lg:flex">
                  {selectedStatuses.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      Filter by status {selectedStatuses.length}
                    </Badge>
                  ) : (
                    VideoQueueStatuses.filter((status: { value: string }) =>
                      selectedStatuses.includes(status.value),
                    ).map((status: { value: string }) => (
                      <Badge
                        variant="secondary"
                        key={status.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {status.value}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id="status-filter-content"
          className="w-[200px] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {VideoQueueStatuses.map((status) => {
                  const isSelected =
                    selectedStatuses && selectedStatuses.includes(status.value);
                  return (
                    <CommandItem
                      key={status.value}
                      onSelect={() => handleSelectStatus(status.value)}
                    >
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-[4px] border",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input [&_svg]:invisible",
                        )}
                      >
                        <Check className="text-primary-foreground size-3.5" />
                      </div>
                      <span>{status.value}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedStatuses && selectedStatuses.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedStatuses([])}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
});

export const VideoQueueFilterStatus = memo(VideoQueueFilterStatusComponent);
