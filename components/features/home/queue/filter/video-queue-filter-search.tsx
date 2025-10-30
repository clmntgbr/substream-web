import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "next/navigation";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

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
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const onSearchChangeRef = useRef(onSearchChange);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!initialized) {
      const searchFromUrl = searchParams.get("search");
      if (searchFromUrl) {
        setSearch(searchFromUrl);
      }
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.length >= 3 || searchTerm.length === 0) {
      onSearchChangeRef.current(searchTerm || undefined);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  const handleClearSearch = () => {
    setSearch("");
    onSearchChangeRef.current(undefined);
  };

  const reset = useCallback(() => {
    setSearch("");
    onSearchChangeRef.current(undefined);
  }, []);

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
