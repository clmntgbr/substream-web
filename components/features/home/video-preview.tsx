import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Option, useOptions } from "@/lib/option";
import { useErrorTranslator } from "@/lib/use-error-translator";
import { useGetTranslation } from "@/lib/use-get-translation";
import { useTranslations } from "@/lib/use-translations";
import { Clock, Film, HardDrive, Loader2, Play, Settings as VideoSettingsIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { VideoSettings } from "./video-settings";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  url: string | null;
  onUploadSuccess?: () => void;
}

export const Preview = ({ open, onOpenChange, file, url, onUploadSuccess }: PreviewProps) => {
  const translations = useTranslations();
  const { resolveErrorMessage, parseErrorPayload, getDefaultErrorMessage } = useErrorTranslator();
  const getTranslation = useGetTranslation();
  const { createOption } = useOptions();
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
  const [language, setLanguage] = useState("auto");

  const uploadFailedTitle = (translations.stream?.status?.upload_failed?.title as string | undefined) || "Upload failed";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Process thumbnail to remove black bars
      const processedThumbnail = await processThumbnail(data.thumbnail_url);
      setThumbnail(processedThumbnail);
      setVideoTitle(data.title);
      setDuration("--:--");
      setFileSize("-- MB");
    } catch (error) {
      console.log("Failed to fetch YouTube video info:", error);
      setThumbnail(null);
      setVideoTitle("");
      setDuration("--:--");
      setFileSize("-- MB");
    }
  };

  const processThumbnail = async (thumbnailUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(thumbnailUrl);
          return;
        }

        // Set canvas size to original image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Get image data to detect black bars
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Find top and bottom black bars
        let topBar = 0;
        let bottomBar = canvas.height;

        // Check top bar
        for (let y = 0; y < canvas.height; y++) {
          let isBlackRow = true;
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Check if pixel is not black (allowing some tolerance)
            if (r > 20 || g > 20 || b > 20) {
              isBlackRow = false;
              break;
            }
          }
          if (!isBlackRow) {
            topBar = y;
            break;
          }
        }

        // Check bottom bar
        for (let y = canvas.height - 1; y >= 0; y--) {
          let isBlackRow = true;
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Check if pixel is not black (allowing some tolerance)
            if (r > 20 || g > 20 || b > 20) {
              isBlackRow = false;
              break;
            }
          }
          if (!isBlackRow) {
            bottomBar = y;
            break;
          }
        }

        // If we found black bars, crop the image
        if (topBar > 0 || bottomBar < canvas.height) {
          const croppedHeight = bottomBar - topBar + 1;
          const croppedCanvas = document.createElement("canvas");
          const croppedCtx = croppedCanvas.getContext("2d");

          if (croppedCtx) {
            croppedCanvas.width = canvas.width;
            croppedCanvas.height = croppedHeight;

            croppedCtx.drawImage(canvas, 0, topBar, canvas.width, croppedHeight, 0, 0, canvas.width, croppedHeight);

            resolve(croppedCanvas.toDataURL("image/jpeg", 0.9));
            return;
          }
        }

        // If no black bars found, return original
        resolve(thumbnailUrl);
      };

      img.onerror = () => {
        resolve(thumbnailUrl);
      };

      img.src = thumbnailUrl;
    });
  };

  const handleProcess = async () => {
    if (!file && !url) {
      toast.error(getTranslation("error.video.no_file_or_url"));
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
        language,
      };

      const option = (await createOption(optionData)) as Option;

      if (!option || !option.id) {
        toast.error(getTranslation("error.video.failed_to_create_options"));
        return;
      }

      let response;

      if (file) {
        const formData = new FormData();
        formData.append("video", file as Blob);
        formData.append("optionId", option.id);
        formData.append("duration", durationSeconds?.toString() || "");

        if (thumbnail) {
          if (thumbnail.startsWith("data:")) {
            const response = await fetch(thumbnail);
            const blob = await response.blob();
            formData.append("thumbnail", blob, "thumbnail.jpg");
          } else {
            const response = await fetch(thumbnail);
            const blob = await response.blob();
            formData.append("thumbnail", blob, "thumbnail.jpg");
          }
        }

        response = await fetch("/api/streams/video", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      } else if (url) {
        const requestBody: {
          url: string;
          optionId: string;
          name: string;
          thumbnail_file?: string;
        } = {
          url: url,
          optionId: option.id,
          name: videoTitle,
        };

        if (thumbnail) {
          requestBody.thumbnail_file = thumbnail;
        }

        response = await fetch("/api/streams/url", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        toast.error(getTranslation("error.video.no_file_or_url_provided"));
        return;
      }

      if (response.ok) {
        const data = (await response.json()) as { message?: string };

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
          key?: string;
          params?: Record<string, unknown>;
        };

        const parsedError = parseErrorPayload(errorData);
        const message = resolveErrorMessage(
          {
            ...parsedError,
            message: parsedError.message ?? errorData.message,
            error: parsedError.error ?? errorData.error,
            params: parsedError.params ?? errorData.params,
          },
          errorData.message || errorData.error || getDefaultErrorMessage()
        );

        toast.error(uploadFailedTitle, {
          description: message,
        });
      }
    } catch (error) {
      const message = (error instanceof Error && error.message) || getDefaultErrorMessage();
      toast.error(getTranslation("error.video.upload_failed"), {
        description: message,
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
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen" hideCloseButton>
          <SheetHeader className="px-4 pt-6 pb-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !isUploading && onOpenChange(false)}
              disabled={isUploading}
              className="absolute right-4 h-11 w-11 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white hover:text-black dark:hover:text-white backdrop-blur-md border border-black/20 dark:border-white/10 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-50"
            >
              <X className="h-5 w-5" />
            </Button>
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
            <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl aspect-video rounded-2xl overflow-hidden group">
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
                <div className="w-full h-full bg-gray-200 animate-pulse" />
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
                  {translations.home.preview.subtitle}
                </p>
              </div>
            </div>
          </div>
          <SheetFooter>
            <div className="backdrop-blur-xl px-6 py-4">
              <div className="flex justify-center gap-3 mx-auto">
                <Button onClick={() => setIsSettingsOpen(true)} variant="outline" disabled={isUploading} className="cursor-pointer">
                  <VideoSettingsIcon className="h-3 w-3 mr-1" />
                  {translations.home.preview.settings.settings}
                  <KbdGroup>
                    <Kbd>⌘ + j</Kbd>
                  </KbdGroup>
                </Button>
                <Button onClick={handleProcess} disabled={isUploading} className="cursor-pointer">
                  <KbdGroup>
                    <Kbd className="bg-black/10 backdrop-blur-md text-white border-white/20 rounded-md px-2 py-1 dark:bg-white/10 dark:border-black/20 dark:text-black">
                      ⌘ + e
                    </Kbd>
                  </KbdGroup>
                  {translations.home.preview.settings.process}
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <VideoSettings
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
        language={language}
        setLanguage={setLanguage}
      />
    </>
  );
};

export default Preview;
