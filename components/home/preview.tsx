import { useTranslations } from "@/lib/use-translations";
import { Clock, Film, HardDrive, Loader2, Play, SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import Settings from "./settings";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  url: string | null;
}

export const Preview = ({ open, onOpenChange, file, url }: PreviewProps) => {
  const t = useTranslations();

  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState<string>("--:--");
  const [fileSize, setFileSize] = useState<string>("-- MB");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [subtitleFont, setSubtitleFont] = useState("Arial");
  const [subtitleSize, setSubtitleSize] = useState(24);
  const [subtitleColor, setSubtitleColor] = useState("#FFFFFF");
  const [subtitleBold, setSubtitleBold] = useState(true);
  const [subtitleItalic, setSubtitleItalic] = useState(false);
  const [subtitleUnderline, setSubtitleUnderline] = useState(false);
  const [subtitleOutlineColor, setSubtitleOutlineColor] = useState("#000000");
  const [subtitleOutlineThickness, setSubtitleOutlineThickness] = useState(2);
  const [subtitleShadow, setSubtitleShadow] = useState(1);
  const [subtitleShadowColor, setSubtitleShadowColor] = useState("#333333");
  const [format, setFormat] = useState("zoomed_916");
  const [chunkNumber, setChunkNumber] = useState(5);
  const [yAxisAlignment, setYAxisAlignment] = useState(0);

  useEffect(() => {
    if (url) {
      handleUrl(url);
    }
    if (file) {
      handleFile(file);
    }
  }, [file, url]);

  const handleLaunchProcess = async () => {};

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
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen p-0 border-0">
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
                    target.src = "/default.png";
                  }}
                />
              ) : (
                <Image src="/default.png" alt="Default thumbnail" width={1920} height={1080} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20">HD Ready</Badge>
              </div>
              <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none" style={{ bottom: `${yAxisAlignment * 100}%` }}>
                <p
                  className="text-center px-4 max-w-[90%]"
                  style={{
                    fontFamily: subtitleFont,
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
                  {t.home.upload.subtitle}
                </p>
              </div>
            </div>
          </div>
          <SheetFooter>
            <div className="backdrop-blur-xl px-6 py-4">
              <div className="flex justify-center gap-3 mx-auto">
                <Button onClick={() => setIsSettingsOpen(true)} variant="outline" disabled={isUploading} className="cursor-pointer">
                  <SettingsIcon className="h-3 w-3 mr-1" />
                  {t.home.upload.settings.settings}
                </Button>
                <Button onClick={handleLaunchProcess} disabled={isUploading} className="cursor-pointer">
                  {t.home.upload.settings.process}
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
      />
    </>
  );
};

export default Preview;
