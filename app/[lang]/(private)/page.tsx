"use client";

import { VideoQueueList, VideoQueueListRef } from "@/components/features/home/queue/video-queue-list";
import VideoUpload from "@/components/features/home/video-upload";
import { useRef } from "react";

const HomePage = () => {
  const queueRef = useRef<VideoQueueListRef>(null);

  const handleUploadSuccess = () => {
    queueRef.current?.resetFilters();
  };

  return (
    <>
      <VideoUpload onUploadSuccess={handleUploadSuccess} />
      <VideoQueueList ref={queueRef} />
    </>
  );
};

export default HomePage;
