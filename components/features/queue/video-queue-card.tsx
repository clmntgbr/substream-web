import Status from "@/components/shared/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useStreams } from "@/lib/stream/context";
import { Stream } from "@/lib/stream/types";
import { format } from "date-fns";
import { BrainCircuit, Download, FileText, MoreVertical, Settings2Icon, SettingsIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import VideoSettings from "../upload/video-settings";

type VideoQueueCardProps = {
  stream: Stream;
};

export function VideoQueueCard({ stream }: VideoQueueCardProps) {
  const { useDownloadStream } = useStreams();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDownload = () => {
    if (!stream.isDownloadable || !stream.id) {
      toast.error("Stream not available");
      return;
    }
    useDownloadStream(stream.id, stream.originalFileName);
  };

  const handleDownloadSubtitle = () => {
    if (!stream.isSrtDownloadable || !stream.id) {
      toast.error("Subtitle not available");
      return;
    }
    // downloadSubtitle(stream.id, stream.originalFileName);
  };

  const handleDownloadResume = () => {
    if (!stream.isResumeDownloadable || !stream.id) {
      toast.error("Resume not available");
      return;
    }
    // downloadResume(stream.id, stream.originalFileName);
  };

  const handleDelete = async () => {
    if (stream.id && confirm(`Are you sure you want to delete "${stream.originalFileName}"?`)) {
      // await deleteStream(stream.id);
    }
  };

  const handleViewOptions = () => {
    setSettingsOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Card key={stream.id} className="flex flex-col gap-0 pt-0 overflow-hidden relative py-0 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-muted size-8 cursor-pointer absolute top-0 right-0 rounded-full bg-accent/50"
            >
              <MoreVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={handleDownload} disabled={!stream.isDownloadable} className="cursor-pointer">
              <Download className="mr-2 size-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadSubtitle} disabled={!stream.isSrtDownloadable} className="cursor-pointer">
              <FileText className="mr-2 size-4" />
              Download subtitle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadResume} disabled={!stream.isResumeDownloadable} className="cursor-pointer">
              <BrainCircuit className="mr-2 size-4" />
              Download resume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewOptions} className="cursor-pointer">
              <SettingsIcon className="mr-2 size-4" />
              View Options
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/stream/${stream.id}`)} className="cursor-pointer">
              <Settings2Icon className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {stream.thumbnailUrl ? (
          <Image
            src={stream.thumbnailUrl}
            alt={stream.originalFileName}
            width={300}
            height={150}
            className="w-full h-[150px] object-cover object-center rounded-t-lg mb-4"
          />
        ) : (
          <div className="w-full h-[150px] bg-muted rounded-t-lg mb-4 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No thumbnail</span>
          </div>
        )}
        <CardHeader className="mb-4 gap-0">
          <CardDescription className="text-xs text-muted-foreground">{formatDate(stream.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-hidden">
          <HoverCard>
            <HoverCardTrigger asChild>
              <CardTitle className="font-medium hover:underline cursor-pointer text-xs mb-10">
                {stream.originalFileName.replace(".mp4", "")}
              </CardTitle>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{stream.originalFileName.replace(".mp4", "")}</h4>
                <div className="flex gap-2">
                  {stream.mimeType && <Badge variant="outline">{stream.mimeType}</Badge>}
                  {stream.sizeInMegabytes && <Badge variant="outline">{stream.sizeInMegabytes.toFixed(2)} MB</Badge>}
                  {stream.duration && <Badge variant="outline">{stream.duration}</Badge>}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="w-full flex justify-center absolute bottom-0 left-0">
                <Status stream={stream} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{stream.status}</h4>
                  <p className="text-sm">{stream.status}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>

      <VideoSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        subtitleFont={stream.option.subtitleFont}
        setSubtitleFont={() => {}}
        subtitleSize={stream.option.subtitleSize}
        setSubtitleSize={() => {}}
        subtitleColor={stream.option.subtitleColor}
        setSubtitleColor={() => {}}
        subtitleBold={stream.option.subtitleBold}
        setSubtitleBold={() => {}}
        subtitleItalic={stream.option.subtitleItalic}
        setSubtitleItalic={() => {}}
        subtitleUnderline={stream.option.subtitleUnderline}
        setSubtitleUnderline={() => {}}
        subtitleOutlineColor={stream.option.subtitleOutlineColor}
        setSubtitleOutlineColor={() => {}}
        subtitleOutlineThickness={stream.option.subtitleOutlineThickness}
        setSubtitleOutlineThickness={() => {}}
        subtitleShadow={stream.option.subtitleShadow}
        setSubtitleShadow={() => {}}
        subtitleShadowColor={stream.option.subtitleShadowColor}
        setSubtitleShadowColor={() => {}}
        format={stream.option.format}
        setFormat={() => {}}
        chunkNumber={stream.option.chunkNumber}
        setChunkNumber={() => {}}
        yAxisAlignment={stream.option.yAxisAlignment}
        setYAxisAlignment={() => {}}
        readOnly={true}
        isResume={stream.option.isResume}
        setIsResume={() => {}}
        language={stream.option.language}
        setLanguage={() => {}}
      />
    </>
  );
}
