import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Play, Settings, X } from "lucide-react";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="top" className="max-w-[100vw] h-screen w-screen p-0 border-0 bg-black/95 backdrop-blur-sm">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{file.name}</h2>
                <p className="text-sm text-white/60">Format : {file.type}</p>
                <p className="text-sm text-white/60">Durée : 12:34</p>
                <p className="text-sm text-white/60">Taille : {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
            <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
              {thumbnail && <Image src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" width={100} height={100} />}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-4 rounded-lg border border-white/10 cursor-pointer">
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
              <Play className="mr-2 h-4 w-4" />
              Lancer le process
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Panneau Settings (sidebar droite) */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Paramètres de lecture
            </SheetTitle>
            <SheetDescription>Personnalisez votre expérience de visionnage</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Qualité */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Qualité vidéo</h3>
              <div className="space-y-2">
                {["Auto", "1080p", "720p", "480p", "360p"].map((quality) => (
                  <Button key={quality} variant="outline" className="w-full justify-start">
                    {quality}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vitesse */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Vitesse de lecture</h3>
              <div className="grid grid-cols-3 gap-2">
                {["0.5x", "1x", "1.25x", "1.5x", "1.75x", "2x"].map((speed) => (
                  <Button key={speed} variant={speed === "1x" ? "default" : "outline"} className="text-sm">
                    {speed}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sous-titres */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Sous-titres</h3>
              <div className="space-y-2">
                {["Désactivé", "Français", "English", "Español"].map((subtitle) => (
                  <Button key={subtitle} variant="outline" className="w-full justify-start">
                    {subtitle}
                  </Button>
                ))}
              </div>
            </div>

            {/* Autres options */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Options avancées</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm">Lecture automatique</span>
                  <Button variant="outline" size="sm">
                    Activer
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm">Mode sombre</span>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm">Notifications</span>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Preview;
