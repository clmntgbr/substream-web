import { useMercure } from "@/lib/mercure/provider";
import { useStreams } from "@/lib/stream/context";
import { useEffect, useState } from "react";
import { VideoQueueFilterDate } from "./filter/video-queue-filter-date";
import { VideoQueueFilterSearch } from "./filter/video-queue-filter-search";
import { VideoQueueFilterStatus } from "./filter/video-queue-filter-status";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueueListEmpty } from "./video-queue-list-empty";
import { VideoQueuePagination } from "./video-queue-pagination";

export const VideoQueueList = () => {
  const { streams, useFetchStreams } = useStreams();
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const { on } = useMercure();

  const handleStatusChange = (status: string[]) => {
    setStatus(status);
    console.log("handleStatusChange");
    useFetchStreams({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handleSearchChange = (search: string) => {
    setSearch(search);
    console.log("handleSearchChange");
    useFetchStreams({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    console.log("handlePageChange");
    useFetchStreams({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setFrom(from);
    setTo(to);
    console.log("handleDateChange");
    useFetchStreams({
      page: page,
      search: search,
      from: from,
      to: to,
      status: status,
    });
  };

  useEffect(() => {
    const unsubscribe = on("streams.refresh", (data) => {
      console.log("useEffect");
      useFetchStreams({
        page: page,
        search: search,
        from: from,
        to: to,
        status: status,
      });
    });

    return unsubscribe;
  }, [on]);

  return (
    <>
      <>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <VideoQueueFilterSearch onSearchChange={handleSearchChange} />
            <VideoQueueFilterStatus onStatusChange={handleStatusChange} />
          </div>
          <VideoQueueFilterDate onDateChange={handleDateChange} />
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
