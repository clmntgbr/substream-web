import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

export const Preview = ({ open, onOpenChange, file }: PreviewProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = fileUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";

    const captureFrame = () => {
      // Get random time between 10% and 90% of video duration
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

      // Cleanup
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
  }, [file]);

  if (!file) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="w-full overflow-y-auto h-full">
        <SheetHeader>
          <SheetTitle>{file.name}</SheetTitle>
          <SheetDescription>
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB | Type: {file.type}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt="Video thumbnail" className="max-w-full h-auto rounded-lg" />
          ) : (
            <div className="w-64 h-36 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Loading thumbnail...</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Preview;
