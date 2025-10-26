import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useStreams } from "@/lib/stream";
import { BrainCircuit, Download, FileText, MoreVertical, Settings2Icon, SettingsIcon, Trash2 } from "lucide-react";
import Image from "next/image";

export function VideoQueueCards() {
  const handleDownload = () => {
    console.log("Download");
  };

  const handleDownloadSubtitle = () => {
    console.log("Download subtitle");
  };

  const handleDownloadResume = () => {
    console.log("Download resume");
  };

  const handleViewOptions = () => {
    console.log("View options");
  };

  const handleViewDetails = () => {
    console.log("View details");
  };

  const handleDelete = () => {
    console.log("Delete");
  };

  const { state } = useStreams();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {state.streams.map((stream) => (
        <Card key={stream.id} className="flex flex-col gap-4 pt-0 overflow-hidden relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="data-[state=open]:bg-muted size-8 cursor-pointer absolute top-0 right-0">
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
              <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
                <Settings2Icon className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete} className="cursor-pointer">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Image
            src={stream.thumbnailUrl ?? ""}
            alt={stream.originalFileName}
            width={300}
            height={150}
            className="w-full h-[150px] object-cover object-center rounded-t-lg"
          />
          <CardHeader>
            <HoverCard>
              <HoverCardTrigger asChild>
                <CardTitle className="line-clamp-3 font-medium hover:underline cursor-pointer text-xs">{stream.originalFileName}</CardTitle>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{stream.originalFileName}</h4>
                  <div className="flex gap-2">
                    {stream.mimeType && <Badge variant="outline">{stream.mimeType}</Badge>}
                    {stream.sizeInMegabytes && <Badge variant="outline">{stream.sizeInMegabytes.toFixed(2)} MB</Badge>}
                    {stream.duration && <Badge variant="outline">{stream.duration}</Badge>}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
        </Card>
      ))}
    </div>
  );
}
