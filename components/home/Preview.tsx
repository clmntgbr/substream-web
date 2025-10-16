import { Settings } from "@/components/home/Settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Option, useOptions } from "@/lib/option";
import { useStreams } from "@/lib/stream";
import { useTranslations } from "@/lib/use-translations";
import { Clock, Film, HardDrive, Loader2, Play, SettingsIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  url: string | null;
  onUploadSuccess?: () => void;
}

export const Preview = ({ open, onOpenChange, file, url, onUploadSuccess }: PreviewProps) => {
  const t = useTranslations();
  const { createOption } = useOptions();
  const { getStreams } = useStreams();

  const [isUploading, setIsUploading] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [duration, setDuration] = useState<string>("--:--");
  const [fileSize, setFileSize] = useState<string>("-- MB");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [subtitleFont, setSubtitleFont] = useState("Arial");
  const [subtitleSize, setSubtitleSize] = useState(15);

  const [subtitleColor, setSubtitleColor] = useState("#FFFFFF");
  const [subtitleOutlineColor, setSubtitleOutlineColor] = useState("#000000");
  const [subtitleShadowColor, setSubtitleShadowColor] = useState("#333333");

  const [subtitleBold, setSubtitleBold] = useState(false);
  const [subtitleItalic, setSubtitleItalic] = useState(false);
  const [subtitleUnderline, setSubtitleUnderline] = useState(false);

  const [subtitleOutlineThickness, setSubtitleOutlineThickness] = useState(0);
  const [subtitleShadow, setSubtitleShadow] = useState(0);

  const [format, setFormat] = useState("original");
  const [chunkNumber, setChunkNumber] = useState(2);
  const [yAxisAlignment, setYAxisAlignment] = useState(0);

  const [isResume, setIsResume] = useState(false);

  useHotkeys("meta+e", () => {
    if (url || file) {
      handleProcess();
    }
  });

  useHotkeys("meta+j", () => {
    if (url || file) {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      } else {
        setIsSettingsOpen(true);
      }
    }
  });

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

    setVideoTitle(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");

    const captureFrame = () => {
      const totalSeconds = Math.floor(video.duration);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formattedDuration =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;

      setDurationSeconds(totalSeconds);
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

  const handleUrl = async (url: string) => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (!response.ok) {
        setThumbnail(null);
        setVideoTitle("");
        setDuration("--:--");
        setFileSize("-- MB");
        return;
      }
      const data = (await response.json()) as {
        thumbnail_url: string;
        title: string;
        author_name: string;
      };

      setThumbnail(data.thumbnail_url);
      setVideoTitle(data.title);
      setDuration("--:--");
      setFileSize("-- MB");
    } catch (error) {
      console.error("Failed to fetch YouTube video info:", error);
      setThumbnail(null);
      setVideoTitle("");
      setDuration("--:--");
      setFileSize("-- MB");
    }
  };

  const handleProcess = async () => {
    if (!file && !url) {
      toast.error("Please upload a file or enter a URL");
      return;
    }

    try {
      setIsUploading(true);

      const optionData = {
        subtitleFont,
        subtitleSize,
        subtitleColor,
        subtitleBold,
        subtitleItalic,
        subtitleUnderline,
        subtitleOutlineColor,
        subtitleOutlineThickness,
        subtitleShadow,
        subtitleShadowColor,
        format,
        chunkNumber,
        yAxisAlignment,
        isResume,
      };

      const option = (await createOption(optionData)) as Option;

      if (!option || !option.id) {
        toast.error("Failed to create options. Please try again.");
        return;
      }

      let response;

      if (file) {
        const formData = new FormData();
        formData.append("video", file as Blob);
        formData.append("optionId", option.id);
        formData.append("duration", durationSeconds?.toString() || "");

        response = await fetch("/api/streams/video", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      } else if (url) {
        response = await fetch("/api/streams/url", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
            optionId: option.id,
            name: videoTitle,
          }),
        });
      } else {
        toast.error("No file or URL provided");
        return;
      }

      if (response.ok) {
        const data = (await response.json()) as { message?: string };
        getStreams();

        // Clean up states
        if (onUploadSuccess) {
          onUploadSuccess();
        }

        onOpenChange(false);

        toast.success("Video uploaded successfully!", {
          description: data.message || "Your video is now being processed.",
        });
      } else {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const errorMessage = errorData.message || errorData.error || "An error occurred while uploading your video.";
        toast.error("Upload failed", {
          description: errorMessage,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while uploading your video.";
      toast.error("Upload failed", {
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
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
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen p-0 border-0" hideCloseButton>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !isUploading && onOpenChange(false)}
            disabled={isUploading}
            className="absolute top-4 right-4 h-11 w-11 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white hover:text-black dark:hover:text-white backdrop-blur-md border border-black/20 dark:border-white/10 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-50"
          >
            <X className="h-5 w-5" />
          </Button>
          <SheetHeader>
            <SheetTitle>{videoTitle}</SheetTitle>
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
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default.jpg";
                  }}
                />
              ) : (
                <Image src="/default.jpg" alt="Default thumbnail" width={1920} height={1080} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20">HD Ready</Badge>
              </div>
              <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none" style={{ bottom: `${yAxisAlignment}px` }}>
                <p
                  className="text-center px-4 max-w-[90%]"
                  style={{
                    fontFamily: `"${subtitleFont}"`,
                    fontSize: `${subtitleSize * 0.8}px`,
                    color: subtitleColor,
                    fontWeight: subtitleBold ? "bold" : "normal",
                    fontStyle: subtitleItalic ? "italic" : "normal",
                    textDecoration: subtitleUnderline ? "underline" : "none",
                    textShadow: `${subtitleOutlineThickness}px ${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, -${subtitleOutlineThickness}px -${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, ${subtitleOutlineThickness}px -${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, -${subtitleOutlineThickness}px ${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, ${subtitleShadow}px ${subtitleShadow}px ${
                      subtitleShadow * 2
                    }px ${subtitleShadowColor}`,
                  }}
                >
                  {t.home.preview.subtitle}
                </p>
              </div>
            </div>
          </div>
          <SheetFooter>
            <div className="backdrop-blur-xl px-6 py-4">
              <div className="flex justify-center gap-3 mx-auto">
                <Button onClick={() => setIsSettingsOpen(true)} variant="outline" disabled={isUploading} className="cursor-pointer">
                  <SettingsIcon className="h-3 w-3 mr-1" />
                  {t.home.preview.settings.settings}
                  <KbdGroup>
                    <Kbd>⌘ + j</Kbd>
                  </KbdGroup>
                </Button>
                <Button onClick={handleProcess} disabled={isUploading} className="cursor-pointer">
                  <KbdGroup>
                    <Kbd>⌘ + e</Kbd>
                  </KbdGroup>
                  {t.home.preview.settings.process}
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-white" />}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Settings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        subtitleFont={subtitleFont}
        setSubtitleFont={setSubtitleFont}
        subtitleSize={subtitleSize}
        setSubtitleSize={setSubtitleSize}
        subtitleColor={subtitleColor}
        setSubtitleColor={setSubtitleColor}
        subtitleBold={subtitleBold}
        setSubtitleBold={setSubtitleBold}
        subtitleItalic={subtitleItalic}
        setSubtitleItalic={setSubtitleItalic}
        subtitleUnderline={subtitleUnderline}
        setSubtitleUnderline={setSubtitleUnderline}
        subtitleOutlineColor={subtitleOutlineColor}
        setSubtitleOutlineColor={setSubtitleOutlineColor}
        subtitleOutlineThickness={subtitleOutlineThickness}
        setSubtitleOutlineThickness={setSubtitleOutlineThickness}
        subtitleShadow={subtitleShadow}
        setSubtitleShadow={setSubtitleShadow}
        subtitleShadowColor={subtitleShadowColor}
        setSubtitleShadowColor={setSubtitleShadowColor}
        format={format}
        setFormat={setFormat}
        chunkNumber={chunkNumber}
        setChunkNumber={setChunkNumber}
        yAxisAlignment={yAxisAlignment}
        setYAxisAlignment={setYAxisAlignment}
        isResume={isResume}
        setIsResume={setIsResume}
      />
    </>
  );
};

export default Preview;
