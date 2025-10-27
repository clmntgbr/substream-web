import { useStreams } from "@/lib/stream";
import { useCallback, useEffect, useRef, useState } from "react";
import { VideoQueueFilterDate } from "./filter/video-queue-filter-date";
import { VideoQueueFilterReset } from "./filter/video-queue-filter-reset";
import { VideoQueueFilterSearch, VideoQueueFilterSearchRef } from "./filter/video-queue-filter-search";
import { VideoQueueFilterStatus, VideoQueueFilterStatusRef } from "./filter/video-queue-filter-status";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueListEmpty } from "./video-queue-list-empty";
import { VideoQueuePagination } from "./video-queue-pagination";

export function VideoQueueList() {
  const { state, searchStreams } = useStreams();
  const [currentStatus, setCurrentStatus] = useState<string[] | undefined>(undefined);
  const [currentSearch, setCurrentSearch] = useState<string | undefined>(undefined);

  const searchRef = useRef<VideoQueueFilterSearchRef>(null);
  const statusRef = useRef<VideoQueueFilterStatusRef>(null);

  const handleFilterChange = useCallback(
    (status: string[] | undefined) => {
      setCurrentStatus(status);
      searchStreams({
        statusFilter: status && status.length > 0 ? status : undefined,
        search: currentSearch,
        page: 1,
      });
    },
    [] // Remove all dependencies to make it stable
  );

  const handleSearchChange = useCallback(
    (search: string | undefined) => {
      setCurrentSearch(search);
      searchStreams({
        search,
        statusFilter: currentStatus && currentStatus.length > 0 ? currentStatus : undefined,
        page: 1,
      });
    },
    [] // Remove all dependencies to make it stable
  );

  const handlePageChange = useCallback(
    (page: number) => {
      searchStreams({
        page,
        statusFilter: currentStatus && currentStatus.length > 0 ? currentStatus : undefined,
        search: currentSearch,
      });
    },
    [] // Remove all dependencies to make it stable
  );

  const handleClearFilters = useCallback(() => {
    setCurrentStatus(undefined);
    setCurrentSearch(undefined);

    searchRef.current?.reset();
    statusRef.current?.reset();

    searchStreams({
      page: 1,
    });
  }, []); // Remove searchStreams dependency

  const hasActiveFilters = currentSearch || (currentStatus && currentStatus.length > 0);

  useEffect(() => {
    const interval = setInterval(() => {
      searchStreams({
        statusFilter: currentStatus && currentStatus.length > 0 ? currentStatus : undefined,
        search: currentSearch,
        page: 1,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [currentStatus, currentSearch]); // Depend on filter values only

  return (
    <>
      <>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <VideoQueueFilterSearch ref={searchRef} onSearchChange={handleSearchChange} />
            <VideoQueueFilterStatus ref={statusRef} onFilterChange={handleFilterChange} />
            {hasActiveFilters && <VideoQueueFilterReset handleClearFilters={handleClearFilters} />}
          </div>
          <VideoQueueFilterDate />
        </div>
      </>

      {state.streams.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
}
