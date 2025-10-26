import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useStreams } from "@/lib/stream/context";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

interface VideoQueueFilterSearchProps {
  onSearchChange: (search: string | undefined) => void;
}

export interface VideoQueueFilterSearchRef {
  reset: () => void;
}

export const VideoQueueFilterSearch = forwardRef<VideoQueueFilterSearchRef, VideoQueueFilterSearchProps>(function VideoQueueFilterSearch(
  { onSearchChange },
  ref
) {
  const [search, setSearch] = useState<string>("");
  const { searchStreams } = useStreams();

  const debouncedSearch = useDebounce(search, 500);

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      // Only search if we have at least 3 characters or if the search is empty (to clear)
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        onSearchChange(searchTerm || undefined);
        await searchStreams({ search: searchTerm || undefined });
      }
    },
    [onSearchChange, searchStreams]
  );

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange(undefined);
  };

  const reset = useCallback(() => {
    setSearch("");
    onSearchChange(undefined);
  }, [onSearchChange]);

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset]
  );

  return (
    <div className="relative">
      <Input
        placeholder="Search by name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="h-8 w-[150px] lg:w-[250px] pr-8"
      />
      {search && (
        <button
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
});
