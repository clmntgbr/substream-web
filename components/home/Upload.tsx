"use client";

import { ImageIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Input } from "../ui/input";

export default function Upload() {
  const [{ files, isDragging }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps }] =
    useFileUpload({
      accept: "video/mp4,video/mov,video/avi,video/mkv,video/webm",
      maxSize: 100 * 1024 * 1024, // 100MB
    });

  return (
    <div className="flex flex-col gap-2 w-2xl mx-auto h-[70vh] justify-center">
      <div className="relative">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="relative flex min-h-52flex-col items-center justify-center overflow-hidden rounded-md border border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        >
          <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV, WEBM (max. 1GB)</p>
            <Button className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
              Select video
            </Button>
          </div>
        </div>
      </div>
      <div className="flex rounded-md shadow-xs">
        <Input
          id="email"
          className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10 dark:bg-background"
          placeholder="https://www.youtube.com/watch?v=aX3z61QftVY"
          type="email"
        />
        <Button>Upload from URL</Button>
      </div>
    </div>
  );
}
