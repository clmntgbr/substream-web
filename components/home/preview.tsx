import { Clock, Film, HardDrive } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  url: string | null;
}

export const Preview = ({ open, onOpenChange, file, url }: PreviewProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState<string>("--:--");
  const [fileSize, setFileSize] = useState<string>("-- MB");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      handleUrl(url);
    }
    if (file) {
      handleFile(file);
    }
  }, [file, url]);

  const handleFile = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = fileUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";

    setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");

    const captureFrame = () => {
      // Format duration
      const totalSeconds = Math.floor(video.duration);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formattedDuration =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;

      setDuration(formattedDuration);

      const randomTime = video.duration * (0.1 + Math.random() * 0.8);
      video.currentTime = randomTime;
    };

    const onSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setThumbnail(thumbnailUrl);
      }

      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", captureFrame);
      URL.revokeObjectURL(fileUrl);
    };

    video.addEventListener("loadedmetadata", captureFrame);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", captureFrame);
      video.removeEventListener("seeked", onSeeked);
      URL.revokeObjectURL(fileUrl);
    };
  };

  const handleUrl = (url: string) => {
    setThumbnail(null);
    setDuration("--:--");
    setFileSize("-- MB");
    return;
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(newOpen) => {
          if (!isUploading) {
            onOpenChange(newOpen);
          }
        }}
      >
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen">
          <SheetHeader>
            <SheetTitle>{file?.name}</SheetTitle>
            <SheetDescription className="flex flex-row gap-2">
              <Badge variant="outline">
                <Film className="h-3 w-3 mr-1" />
                video/mp4
              </Badge>
              <Badge variant="default">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </Badge>
              <Badge variant="secondary">
                <HardDrive className="h-3 w-3 mr-1" />
                {fileSize}
              </Badge>
            </SheetDescription>
          </SheetHeader>
          <div className="relative h-full w-full flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />

              {thumbnail ? (
                <Image src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" width={1920} height={1080} priority />
              ) : (
                <div className="w-full h-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="h-16 w-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto">
                      <Film className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Chargement de l&apos;aperçu...</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20">HD Ready</Badge>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Preview;
