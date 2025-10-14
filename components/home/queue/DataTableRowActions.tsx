"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStreams } from "@/lib/stream/context";
import { Stream } from "@/lib/stream/types";
import { Row } from "@tanstack/react-table";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const stream = row.original as Stream;
  const { downloadStream, deleteStream } = useStreams();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleDownload} disabled={!stream.isCompleted}>
          <Download className="mr-2 size-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="mr-2 size-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
