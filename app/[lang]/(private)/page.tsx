"use client";

import { VideoQueueCards } from "@/components/features/home/queue/video-queue-cards";
import VideoUpload from "@/components/features/home/video-upload";

const HomePage = () => {
  return (
    <>
      <VideoUpload />
      <VideoQueueCards />
    </>
  );
};

export default HomePage;
