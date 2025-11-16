import { Input } from "@/components/ui/input";
import { forwardRef, memo, useState } from "react";

interface VideoQueueFilterSearchProps {
  onSearchChange: (search: string | undefined) => void;
}

const VideoQueueFilterSearchComponent = forwardRef<void, VideoQueueFilterSearchProps>(function VideoQueueFilterSearch({ onSearchChange }, ref) {
  const [search, setSearch] = useState<string>("");

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange(undefined);
  };

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
