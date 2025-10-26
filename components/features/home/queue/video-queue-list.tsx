import { useStreams } from "@/lib/stream";
import { VideoQueueCard } from "./video-queue-card";
import { VideoQueuePagination } from "./video-queue-pagination";

export function VideoQueueList() {
  const { state } = useStreams();
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {state.streams.map((stream) => (
          <VideoQueueCard key={stream.id} stream={stream} />
        ))}
      </div>
      <VideoQueuePagination />
    </>
  );
}
