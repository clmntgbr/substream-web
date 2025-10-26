import { useStreams } from "@/lib/stream";
import { useState } from "react";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueFilter } from "./video-queue-filter";
import { VideoQueuePagination } from "./video-queue-pagination";

export function VideoQueueList() {
  const { state, searchStreams } = useStreams();
  const [currentStatus, setCurrentStatus] = useState<string[] | undefined>(undefined);

  const handleFilterChange = (status: string[] | undefined) => {
    setCurrentStatus(status);
    searchStreams({
      statusFilter: status && status.length > 0 ? status : undefined,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    searchStreams({
      page,
      statusFilter: currentStatus && currentStatus.length > 0 ? currentStatus : undefined,
    });
  };

  return (
    <>
      <div className="flex items-center mb-6 gap-4">
        <VideoQueueFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {state.streams.map((stream) => (
          <VideoQueueCard key={stream.id} stream={stream} />
        ))}
      </div>
      <VideoQueuePagination onPageChange={handlePageChange} />
    </>
  );
}
