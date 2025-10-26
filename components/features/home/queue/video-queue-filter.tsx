import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import { Check, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { VideoQueueStatuses } from "./video-queue-statuses";

interface VideoQueueFilterProps {
  onFilterChange: (status: string[] | undefined) => void;
}

export function VideoQueueFilter({ onFilterChange }: VideoQueueFilterProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const t = useTranslations();

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status) ? selectedStatuses.filter((s) => s !== status) : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    onFilterChange(newStatuses.length > 0 ? newStatuses : undefined);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    onFilterChange(undefined);
  };

  return (
    <>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed cursor-pointer hover:bg-accent hover:text-accent-foreground bg-white dark:bg-input"
          >
            <PlusCircle />
            {t.home.queue.filterByStatus}
            {selectedStatuses.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedStatuses.length}
                </Badge>
                <div className="hidden gap-1 lg:flex">
                  {selectedStatuses.length > 2 ? (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {t.home.queue.filterByStatus} {selectedStatuses.length}
                    </Badge>
                  ) : (
                    VideoQueueStatuses.filter((status: { value: string }) => selectedStatuses.includes(status.value)).map(
                      (status: { value: string }) => (
                        <Badge variant="secondary" key={status.value} className="rounded-sm px-1 font-normal">
                          {status.value}
                        </Badge>
                      )
                    )
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {VideoQueueStatuses.map((status) => {
                  const isSelected = selectedStatuses.includes(status.value);
                  return (
                    <CommandItem key={status.value} onSelect={() => handleStatusToggle(status.value)}>
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-[4px] border",
                          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input [&_svg]:invisible"
                        )}
                      >
                        <Check className="text-primary-foreground size-3.5" />
                      </div>
                      <span>{status.value}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedStatuses.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleClearFilters} className="justify-center text-center">
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedStatuses.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            handleClearFilters();
          }}
        >
          {t.home.queue.resetFilters}
          <X />
        </Button>
      )}
    </>
  );
}
