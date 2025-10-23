"use client";

import { ImageIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { YoutubeUrlSchema } from "../misc/YoutubeUrlSchema";
import { Input } from "../ui/input";
import Preview from "./Preview";

export default function Upload() {
  const [url, setUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
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
    setIsProcessing(false);
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
  return (
    <div className="flex flex-col gap-2 w-2xl mx-auto h-[70vh] justify-center">
      <div className="relative">
        <div className="relative flex min-h-52flex-col items-center justify-center dark:bg-input/30 overflow-hidden rounded-md border border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50">
          <input id="file-input" type="file" multiple className="hidden" accept=".mp4" onChange={handleFileChange} />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV, WEBM (max. 1GB)</p>
            <Button className="mt-4" onClick={() => document.getElementById("file-input")?.click()}>
              <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
              Select video
            </Button>
          </div>
        </div>
      </div>
      <div className="flex rounded-md shadow-xs">
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
            setIsProcessing(true);
            try {
              YoutubeUrlSchema.parse(urlInput);
              setUrl(urlInput);
              setIsPreviewOpen(true);
              setUrlInput("");
            } catch {
              toast.error("Invalid YouTube URL", {
                description: "Please enter a valid YouTube URL",
              });
            } finally {
              setIsProcessing(false);
            }
          }}
        >
          Upload from URL
        </Button>
      </div>
      <Preview open={isPreviewOpen} onOpenChange={handlePreviewClose} file={selectedFile} url={url} onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}
