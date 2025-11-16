"use client";

import { VideoQueueList } from "@/components/features/queue/video-queue-list";
import Upload from "@/components/features/upload/video-upload";

export default function StudioPage() {
  return (
    <>
      <Upload />
      <VideoQueueList />
    </>
  );
}
