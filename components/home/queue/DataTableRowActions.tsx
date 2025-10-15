"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStreams } from "@/lib/stream/context";
import { Stream } from "@/lib/stream/types";
import { Row } from "@tanstack/react-table";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Settings } from "../Settings";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const stream = row.original as Stream;
  const { downloadStream, deleteStream } = useStreams();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDownload = () => {
    if (stream.id && stream.isCompleted) {
      downloadStream(stream.id, stream.originalFileName);
    }
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
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleDownload} disabled={!stream.isCompleted} className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Download
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
      />
    </>
  );
}
