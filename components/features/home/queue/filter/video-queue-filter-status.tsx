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
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import { Check, PlusCircle } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { VideoQueueStatuses } from "../video-queue-statuses";

interface VideoQueueFilterStatusProps {
  onFilterChange: (status: string[] | undefined) => void;
}

export interface VideoQueueFilterStatusRef {
  reset: () => void;
}

export const VideoQueueFilterStatus = forwardRef<
  VideoQueueFilterStatusRef,
  VideoQueueFilterStatusProps
>(function VideoQueueFilterStatus({ onFilterChange }, ref) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const translations = useTranslations();

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    onFilterChange(newStatuses.length > 0 ? newStatuses : undefined);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    onFilterChange(undefined);
  };

  const reset = useCallback(() => {
    setSelectedStatuses([]);
    onFilterChange(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove onFilterChange dependency to avoid re-creation

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset],
  );

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
            {translations.home.queue.filterByStatus}
            {selectedStatuses.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedStatuses.length}
                </Badge>
                <div className="hidden gap-1 lg:flex">
                  {selectedStatuses.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {translations.home.queue.filterByStatus}{" "}
                      {selectedStatuses.length}
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
                        {
                          translations.stream.status[
                            status.value as keyof typeof translations.stream.status
                          ].title
                        }
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
          suppressHydrationWarning
        >
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {VideoQueueStatuses.map((status) => {
                  const isSelected = selectedStatuses.includes(status.value);
                  return (
                    <CommandItem
                      key={status.value}
                      onSelect={() => handleStatusToggle(status.value)}
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
                      <span>
                        {
                          translations.stream.status[
                            status.value as keyof typeof translations.stream.status
                          ].title
                        }
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedStatuses.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClearFilters}
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
