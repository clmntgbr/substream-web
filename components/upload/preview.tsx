import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { ArrowRight, Settings, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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
      <SheetContent side="top" className="w-full overflow-y-auto h-full bg-secondary">
        <SheetHeader></SheetHeader>
        <div className="bg-card border border-border rounded-lg w-4xl mx-auto my-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video size={20} className="text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground truncate">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative">
                {thumbnail && <Image src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" width={100} height={100} />}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Preview updates automatically as you change settings</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings /> Settings
                </Button>
                <Button variant="default" size="sm">
                  Process File <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Preview;
