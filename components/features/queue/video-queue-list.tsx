import { useStreams } from "@/lib/stream/context";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoQueueFilterSearch } from "./filter/video-queue-filter-search";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueListEmpty } from "./video-queue-list-empty";
import { VideoQueuePagination } from "./video-queue-pagination";

export const VideoQueueList = () => {
  const { streams, useFetchStreams } = useStreams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = () => {};

  const handleSearchChange = (search: string) => {
    useFetchStreams({
      page: 1,
      search: search,
    });
  };

  const handlePageChange = (page: number) => {
    useFetchStreams({
      page: page,
    });
  };

  const handleDateChange = () => {};

  return (
    <>
      <>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <VideoQueueFilterSearch onSearchChange={handleSearchChange} />
            {/* <VideoQueueFilterStatus ref={statusRef} onFilterChange={handleFilterChange} /> */}
          </div>
          {/* <VideoQueueFilterDate ref={dateRef} onDateChange={handleDateChange} /> */}
        </div>
      </>

      {streams.member.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {streams.member.map((stream) => (
              <VideoQueueCard key={stream.id} stream={stream} />
            ))}
          </div>
          <VideoQueuePagination onPageChange={handlePageChange} />
        </>
      )}

      {streams.member.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <VideoQueueListEmpty />
        </div>
      )}
    </>
  );
};

VideoQueueList.displayName = "VideoQueueList";
