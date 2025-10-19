"use client";

import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Stream } from "@/lib/stream/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

type Translations = {
  home: {
    queue: {
      columns: Record<string, string>;
    };
  };
  stream: {
    status: Record<string, { title: string; description: string }>;
  };
};

const getLocale = (lang?: string) => {
  return lang === "fr" ? fr : enUS;
};

export const getColumns = (t: Translations, lang?: string): ColumnDef<Stream>[] => [
  {
    id: "select",
    header: () => <></>,
    cell: () => <></>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "originalFileName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.home.queue.columns.originalFileName as string} />,
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="max-w-[400px] truncate font-medium hover:underline cursor-pointer">{row.getValue("originalFileName")}</p>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{row.getValue("originalFileName")}</h4>
              <div className="flex gap-2">
                {row.original.mimeType && <Badge variant="outline">{row.original.mimeType}</Badge>}
                {row.original.sizeInMegabytes && <Badge variant="outline">{row.original.sizeInMegabytes.toFixed(2)} MB</Badge>}
                {row.original.duration && <Badge variant="outline">{row.original.duration}</Badge>}
              </div>
              <div className="text-muted-foreground text-xs">
                {format(new Date(row.original.createdAt), "PPp", {
                  locale: getLocale(lang),
                })}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.home.queue.columns.status as string} />,
    cell: ({ row }) => {
      const stream = row.original;
      const status = stream.status;

      const statusTranslation = t.stream.status[status as keyof typeof t.stream.status];

      return (
        <>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge variant="outline" className="text-muted-foreground px-1.5 cursor-pointer">
                {stream.isCompleted && (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    {statusTranslation?.title}
                  </>
                )}
                {stream.isFailed && (
                  <>
                    <XCircle className="size-4 text-red-500" /> {t.stream.status.failed.title}
                  </>
                )}
                {stream.isProcessing && (
                  <>
                    <Loader2 className="size-4 animate-spin text-blue-400" />
                    {t.stream.status.in_process.title}
                  </>
                )}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{statusTranslation?.title || status}</h4>
                  <p className="text-sm">{statusTranslation?.description}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.home.queue.columns.progress as string} />,
    cell: ({ row }) => {
      const stream = row.original;
      const progress = stream.progress || 0;

      return (
        <div className="flex items-center gap-2 w-[150px]">
          <Progress value={progress} className="h-2" indicatorClassName={"bg-blue-500"} />
          <span className="text-xs text-muted-foreground w-[40px]">{Math.round(progress)}%</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "size",
    accessorKey: "size",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.home.queue.columns.sizeInMegabytes as string} />,
    cell: ({ row }) => {
      const size = row.original.sizeInMegabytes || 0;
      return <div className="w-[80px]">{size ? size.toFixed(2) + " MB" : "--"}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.home.queue.columns.createdAt as string} />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="w-[140px] text-sm text-muted-foreground">{format(new Date(createdAt), "PP p", { locale: getLocale(lang) })}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
