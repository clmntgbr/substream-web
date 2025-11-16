"use client";

import VideoPreview from "@/components/features/uploaddd/video-preview";
import { YoutubeUrlSchema } from "@/components/shared/misc/youtube-url-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Upload() {
  const [url, setUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const videoExtensions = [".mp4"];

    Array.from(files).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

      if (isVideo) {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    });

    event.target.value = "";
  };

  const handlePreviewClose = (open: boolean) => {
    setIsPreviewOpen(open);
    if (!open) {
      setSelectedFile(null);
      setUrl("");
    }
  };

  const handleUploadSuccess = () => {
    setSelectedFile(null);
    setUrl("");
    setUrlInput("");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

      Array.from(files).forEach((file) => {
        const fileName = file.name.toLowerCase();
        const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext)) || file.type.startsWith("video/");

        if (isVideo) {
          setSelectedFile(file);
          setIsPreviewOpen(true);
        } else {
          toast.error("Invalid file type", {
            description: "Please drop a video file (MP4, MOV, AVI, MKV, WEBM)",
          });
        }
      });
    }
  };
  return (
    <div className="flex flex-col gap-2 w-2xl max-w-full mx-auto h-[80vh] justify-center">
      <div className="relative mb-4 flex flex-col items-center px-4 text-center md:mb-6">
        <div className="flex w-full flex-col items-center justify-center gap-2"></div>
        <h1 className="mb-2 flex items-center gap-1 text-3xl font-bold leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
          <span className="pt-0.5 tracking-tight md:pt-0">Build video clips</span>
        </h1>
        <p className="mb-6 max-w-[25ch] text-center text-lg leading-tight text-foreground/65 md:max-w-full md:text-xl">
          Create videos clips from your videos with AI
        </p>
      </div>
      <div className="relative">
        <div
          className={`relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-md border p-4 transition-all duration-200`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input id="file-input" type="file" multiple className="hidden" accept=".mp4,.mov,.avi,.mkv,.webm" onChange={handleFileChange} />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className={`mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-200`}
              aria-hidden="true"
            >
              <ImageIcon className={`size-4 transition-colors duration-200 opacity-60`} />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV, WEBM (max. 1GB)</p>
            <Button className="mt-4" onClick={() => document.getElementById("file-input")?.click()}>
              <UploadIcon className="-ms-1 size-4 opacity-60 mr-2" aria-hidden="true" />
              Select video
            </Button>
          </div>
        </div>
      </div>
      <div className="flex rounded-md shadow-none">
        <Input
          id="email"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
          }}
          className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 font-medium placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="https://www.youtube.com/watch?v=aX3z61QftVY"
          type="email"
        />
        <Button
          onClick={() => {
            try {
              YoutubeUrlSchema.parse(urlInput);
              setUrl(urlInput);
              setIsPreviewOpen(true);
              setUrlInput("");
            } catch {
              toast.error("Invalid YouTube URL", {
                description: "Please enter a valid YouTube URL",
              });
            }
          }}
        >
          Upload from URL
        </Button>
      </div>
      <VideoPreview open={isPreviewOpen} onOpenChange={handlePreviewClose} file={selectedFile} url={url} onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}
