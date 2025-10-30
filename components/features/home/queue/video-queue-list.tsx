import { useStreams } from "@/lib/stream";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { VideoQueueFilterDate, VideoQueueFilterDateRef } from "./filter/video-queue-filter-date";
import { VideoQueueFilterReset } from "./filter/video-queue-filter-reset";
import { VideoQueueFilterSearch, VideoQueueFilterSearchRef } from "./filter/video-queue-filter-search";
import { VideoQueueFilterStatus, VideoQueueFilterStatusRef } from "./filter/video-queue-filter-status";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueListEmpty } from "./video-queue-list-empty";
import { VideoQueuePagination } from "./video-queue-pagination";

export interface VideoQueueListRef {
  resetFilters: () => void;
}

export const VideoQueueList = forwardRef<VideoQueueListRef>((_, ref) => {
  const { state, searchStreams, refreshCounter } = useStreams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchRef = useRef<VideoQueueFilterSearchRef>(null);
  const statusRef = useRef<VideoQueueFilterStatusRef>(null);
  const dateRef = useRef<VideoQueueFilterDateRef>(null);
  const searchStreamsRef = useRef(searchStreams);

  useEffect(() => {
    searchStreamsRef.current = searchStreams;
  }, [searchStreams]);

  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            if (key === "page" && value === "1") {
              return;
            }
            params.set(key, value);
          }
        }
      });

      const urlString = params.toString();
      router.push(urlString ? `?${urlString}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  const handleFilterChange = useCallback(
    (status: string[] | undefined) => {
      updateUrl({ status, page: "1" });
    },
    [updateUrl]
  );

  const handleSearchChange = useCallback(
    (search: string | undefined) => {
      updateUrl({ search, page: "1" });
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page: page.toString() });
    },
    [updateUrl]
  );

  const handleDateChange = useCallback(
    (from: Date | undefined, to: Date | undefined) => {
      updateUrl({
        from: from?.toISOString(),
        to: to?.toISOString(),
        page: "1",
      });
    },
    [updateUrl]
  );

  const handleClearFilters = useCallback(() => {
    searchRef.current?.reset();
    statusRef.current?.reset();
    dateRef.current?.reset();
    router.push("?", { scroll: false });
  }, [router]);

  useImperativeHandle(ref, () => ({
    resetFilters: handleClearFilters,
  }));

  const paramsString = searchParams.toString();

  useEffect(() => {
    const status = searchParams.getAll("status");
    const search = searchParams.get("search");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Number(searchParams.get("page")) || 1;

    searchStreamsRef.current({
      statusFilter: status.length > 0 ? status : undefined,
      search: search || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]);

  useEffect(() => {
    if (refreshCounter > 0) {
      const status = searchParams.getAll("status");
      const search = searchParams.get("search");
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const page = Number(searchParams.get("page")) || 1;

      searchStreamsRef.current({
        statusFilter: status.length > 0 ? status : undefined,
        search: search || undefined,
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
        page,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);

  const hasActiveFilters =
    searchParams.has("search") || searchParams.getAll("status").length > 0 || searchParams.has("from") || searchParams.has("to");

  return (
    <>
      <>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <VideoQueueFilterSearch ref={searchRef} onSearchChange={handleSearchChange} />
            <VideoQueueFilterStatus ref={statusRef} onFilterChange={handleFilterChange} />
            {hasActiveFilters && <VideoQueueFilterReset handleClearFilters={handleClearFilters} />}
          </div>
          <VideoQueueFilterDate ref={dateRef} onDateChange={handleDateChange} />
        </div>
      </>

      {state.streams.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {state.streams.map((stream) => (
              <VideoQueueCard key={stream.id} stream={stream} />
            ))}
          </div>
          <VideoQueuePagination onPageChange={handlePageChange} />
        </>
      )}

      {state.streams.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <VideoQueueListEmpty />
        </div>
      )}
    </>
  );
});

VideoQueueList.displayName = "VideoQueueList";
