"use client";

import { Row } from "@tanstack/react-table";
import { Download, Loader2, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Stream, useStreams } from "@/lib/stream";
import { Button } from "../ui/button";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { deleteStream, downloadStream, state } = useStreams();
  const stream = row.original as Stream;
  const streamId = stream.id;
  const isDownloading = streamId ? state.downloadingIds.has(streamId) : false;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion
    if (streamId && confirm("Are you sure you want to delete this stream?")) {
      await deleteStream(streamId);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion
    if (streamId && stream.status === "completed") {
      const filename = `${stream.originalFileName || `stream-${streamId}`}.zip`;
      await downloadStream(streamId, filename);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted size-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {stream.status === "completed" && (
          <>
            <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
