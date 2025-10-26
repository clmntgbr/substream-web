"use client";

import { VideoQueueList } from "@/components/features/home/queue/video-queue-list";
import VideoUpload from "@/components/features/home/video-upload";

const HomePage = () => {
  return (
    <>
      <VideoUpload />
      <VideoQueueList />
    </>
  );
};

export default HomePage;
