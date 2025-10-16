"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStreams } from "@/lib/stream/context";
import { Stream } from "@/lib/stream/types";
import { useTranslations } from "@/lib/use-translations";
import { Row } from "@tanstack/react-table";
import { Download, Eye, FileText, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Settings } from "../Settings";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const stream = row.original as Stream;
  const { downloadStream, downloadSubtitle, deleteStream } = useStreams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = useTranslations();

  const handleDownload = () => {
    if (!stream.isDownloadable || !stream.id) {
      toast.error(t.home.queue.actions.streamNotAvailable);
      return;
    }
    downloadStream(stream.id, stream.originalFileName);
  };

  const handleDownloadSubtitle = () => {
    if (!stream.isSrtDownloadable || !stream.id) {
      toast.error(t.home.queue.actions.subtitleNotAvailable);
      return;
    }
    downloadSubtitle(stream.id, stream.originalFileName);
  };

  const handleDelete = async () => {
    if (stream.id && confirm(`Are you sure you want to delete "${stream.originalFileName}"?`)) {
      await deleteStream(stream.id);
    }
  };

  const handleViewDetails = () => {
    setSettingsOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8 cursor-pointer">
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
          <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
            <Eye className="mr-2 size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete} className="cursor-pointer">
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Settings
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
      />
    </>
  );
}
