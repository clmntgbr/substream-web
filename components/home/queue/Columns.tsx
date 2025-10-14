"use client";

import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Stream } from "@/lib/stream/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

type Translations = {
  stream: {
    status: Record<string, string>;
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="max-w-[300px] truncate font-medium hover:underline cursor-pointer">{row.getValue("originalFileName")}</span>
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const stream = row.original;
      const status = stream.status;

      let icon = null;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      let className = "";

      if (stream.isCompleted) {
        icon = <CheckCircle2 className="size-4 text-emerald-400" />;
        variant = "secondary";
        className = "bg-emerald-400";
      } else if (stream.isFailed) {
        icon = <XCircle className="size-4 text-red-500" />;
        variant = "destructive";
      } else if (stream.isProcessing) {
        icon = <Loader2 className="size-4 animate-spin text-orange-400" />;
        variant = "secondary";
        className = "bg-orange-300";
      } else {
        icon = <Clock className="size-4 text-gray-500" />;
        variant = "outline";
      }

      return (
        <div className="flex items-center gap-2">
          {icon}
          <Badge variant={variant} className={className}>
            {t.stream.status[status as keyof typeof t.stream.status] || status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Progress" />,
    cell: ({ row }) => {
      const stream = row.original;
      const progress = stream.progress || 0;

      return (
        <div className="flex items-center gap-2 w-[150px]">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground w-[40px]">{Math.round(progress)}%</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "sizeInMegabytes",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
    cell: ({ row }) => {
      const size = row.getValue("sizeInMegabytes") as number | null;
      return <div className="w-[80px]">{size ? size.toFixed(2) + " MB" : "--"}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
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
