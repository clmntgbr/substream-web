import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface VideoQueueFilterSearchProps {
  onSearchChange: (search: string | undefined) => void;
}

export interface VideoQueueFilterSearchRef {
  reset: () => void;
}

function getInitialSearch() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("search") || "";
}

const VideoQueueFilterSearchComponent = forwardRef<
  VideoQueueFilterSearchRef,
  VideoQueueFilterSearchProps
>(function VideoQueueFilterSearch({ onSearchChange }, ref) {
  const [search, setSearch] = useState<string>(() => getInitialSearch());
  const onSearchChangeRef = useRef(onSearchChange);

  const debouncedSearch = useDebounce(search, 500);

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
    [reset],
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

export const VideoQueueFilterSearch = memo(VideoQueueFilterSearchComponent);
