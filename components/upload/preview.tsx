"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Clock, Film, HardDrive, Play, Settings, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

export const Preview = ({ open, onOpenChange, file }: PreviewProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("--:--");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = fileUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";

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
  }, [file]);

  if (!file) return null;

  const fileSize = (file.size / 1024 / 1024).toFixed(2);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen p-0 border-0 bg-black">
          <SheetHeader className="sr-only">
            <SheetTitle>Aperçu vidéo</SheetTitle>
            <SheetDescription>Prévisualisation et paramètres de la vidéo</SheetDescription>
          </SheetHeader>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.04),transparent_50%)]" />

          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-8 pb-20">
            <div className="container mx-auto px-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg">
                      <Film className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-slate-950">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white  mb-1">{file.name}</h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/15">
                          <Film className="h-3 w-3 mr-1" />
                          {file.type.split("/")[1].toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/15">
                          <Clock className="h-3 w-3 mr-1" />
                          {duration}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/15">
                          <HardDrive className="h-3 w-3 mr-1" />
                          {fileSize} MB
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsSettingsOpen(true)}
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-slate-700/20 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 cursor-pointer">
                  <Play className="mr-2 h-4 w-4 fill-white" />
                  Lancer le process
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-y-auto px-2">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Paramètres de lecture
            </SheetTitle>
            <SheetDescription>Personnalisez votre expérience de visionnage</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Preview;
