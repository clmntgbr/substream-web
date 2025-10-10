"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useOptions } from "@/lib/option";
import { useStreams } from "@/lib/stream";
import { Clock, Film, HardDrive, Loader2, Play, Settings, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

export const Preview = ({ open, onOpenChange, file }: PreviewProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("--:--");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { getStreams } = useStreams();
  const { createOption } = useOptions();
  const [isUploading, setIsUploading] = useState(false);

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
  const [yAxisAlignment, setYAxisAlignment] = useState(0.85);

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

  const handleLaunchProcess = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
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
      };

      const option = await createOption(optionData);

      if (!option || !option.id) {
        return;
      }

      const formData = new FormData();
      formData.append("video", file);
      formData.append("optionId", option.id);

      const response = await fetch("/api/streams/video", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        getStreams();
        onOpenChange(false);
        toast.success("Video uploaded successfully!", {
          description: "Your video is now being processed.",
        });
      } else {
        await response.json();
        toast.error("Upload failed", {
          description: "An error occurred while uploading your video.",
        });
      }
    } catch (error) {
      console.error("Process failed:", error);
      toast.error("Upload failed", {
        description: "An error occurred while uploading your video.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!file) return null;

  const fileSize = (file.size / 1024 / 1024).toFixed(2);

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
                  onClick={() => !isUploading && onOpenChange(false)}
                  disabled={isUploading}
                  className="h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Subtitle Preview Overlay */}
              <div
                className="absolute inset-x-0 flex items-center justify-center pointer-events-none"
                style={{ bottom: `${(1 - yAxisAlignment) * 100}%` }}
              >
                <p
                  className="text-center px-4 max-w-[90%]"
                  style={{
                    fontFamily: subtitleFont,
                    fontSize: `${subtitleSize * 0.8}px`, // Scale down for preview
                    color: subtitleColor,
                    fontWeight: subtitleBold ? "bold" : "normal",
                    fontStyle: subtitleItalic ? "italic" : "normal",
                    textDecoration: subtitleUnderline ? "underline" : "none",
                    textShadow: `${subtitleOutlineThickness}px ${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, -${subtitleOutlineThickness}px -${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, ${subtitleOutlineThickness}px -${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, -${subtitleOutlineThickness}px ${subtitleOutlineThickness}px 0 ${subtitleOutlineColor}, ${subtitleShadow}px ${subtitleShadow}px ${
                      subtitleShadow * 2
                    }px ${subtitleShadowColor}`,
                  }}
                >
                  Exemple de sous-titre
                </p>
              </div>

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
                  disabled={isUploading}
                  className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-slate-700/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button
                  onClick={handleLaunchProcess}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-white" />}
                  {isUploading ? "Upload en cours..." : "Lancer le process"}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-y-auto px-4">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Paramètres des sous-titres
            </SheetTitle>
            <SheetDescription>Configurez l&apos;apparence et le format des sous-titres</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Font Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Police et Taille</h3>
              <div className="space-y-2">
                <Label htmlFor="font">Police</Label>
                <Input id="font" value={subtitleFont} onChange={(e) => setSubtitleFont(e.target.value)} placeholder="Arial" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Taille: {subtitleSize}px</Label>
                <Slider id="size" min={12} max={48} step={1} value={[subtitleSize]} onValueChange={(value) => setSubtitleSize(value[0])} />
              </div>
            </div>

            <Separator />

            {/* Color Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Couleurs</h3>
              <div className="space-y-2">
                <Label htmlFor="color">Couleur du texte</Label>
                <div className="flex gap-2">
                  <Input id="color" type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-20 h-10" />
                  <Input value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} placeholder="#FFFFFF" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outlineColor">Couleur du contour</Label>
                <div className="flex gap-2">
                  <Input
                    id="outlineColor"
                    type="color"
                    value={subtitleOutlineColor}
                    onChange={(e) => setSubtitleOutlineColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input value={subtitleOutlineColor} onChange={(e) => setSubtitleOutlineColor(e.target.value)} placeholder="#000000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shadowColor">Couleur de l&apos;ombre</Label>
                <div className="flex gap-2">
                  <Input
                    id="shadowColor"
                    type="color"
                    value={subtitleShadowColor}
                    onChange={(e) => setSubtitleShadowColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input value={subtitleShadowColor} onChange={(e) => setSubtitleShadowColor(e.target.value)} placeholder="#333333" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Text Style */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Style du texte</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="bold">Gras</Label>
                <Switch id="bold" checked={subtitleBold} onCheckedChange={setSubtitleBold} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="italic">Italique</Label>
                <Switch id="italic" checked={subtitleItalic} onCheckedChange={setSubtitleItalic} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="underline">Souligné</Label>
                <Switch id="underline" checked={subtitleUnderline} onCheckedChange={setSubtitleUnderline} />
              </div>
            </div>

            <Separator />

            {/* Effects */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Effets</h3>
              <div className="space-y-2">
                <Label htmlFor="outlineThickness">Épaisseur du contour: {subtitleOutlineThickness}px</Label>
                <Slider
                  id="outlineThickness"
                  min={0}
                  max={10}
                  step={1}
                  value={[subtitleOutlineThickness]}
                  onValueChange={(value) => setSubtitleOutlineThickness(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shadow">Ombre: {subtitleShadow}px</Label>
                <Slider id="shadow" min={0} max={5} step={1} value={[subtitleShadow]} onValueChange={(value) => setSubtitleShadow(value[0])} />
              </div>
            </div>

            <Separator />

            {/* Position & Format */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Position et Format</h3>
              <div className="space-y-2">
                <Label htmlFor="yAxis">Position verticale: {(yAxisAlignment * 100).toFixed(0)}%</Label>
                <Slider id="yAxis" min={0} max={1} step={0.01} value={[yAxisAlignment]} onValueChange={(value) => setYAxisAlignment(value[0])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="original" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chunks">Nombre de segments: {chunkNumber}</Label>
                <Slider id="chunks" min={1} max={20} step={1} value={[chunkNumber]} onValueChange={(value) => setChunkNumber(value[0])} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Preview;
