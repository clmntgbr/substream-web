"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stream } from "@/lib/stream/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

export const Columns: ColumnDef<Stream>[] = [
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
        <div className="flex gap-2 items-center">
          <span className="max-w-[300px] truncate font-medium">{row.getValue("originalFileName")}</span>
        </div>
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

      if (stream.isCompleted) {
        icon = <CheckCircle2 className="size-4 text-green-500" />;
        variant = "outline";
      } else if (stream.isFailed) {
        icon = <XCircle className="size-4 text-red-500" />;
        variant = "destructive";
      } else if (stream.isProcessing) {
        icon = <Loader2 className="size-4 animate-spin text-blue-500" />;
        variant = "secondary";
      } else {
        icon = <Clock className="size-4 text-gray-500" />;
        variant = "outline";
      }

      return (
        <div className="flex items-center gap-2">
          {icon}
          <Badge variant={variant}>{status}</Badge>
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
      const size = row.getValue("sizeInMegabytes") as number;
      return <div className="w-[80px]">{size.toFixed(2)} MB</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="w-[120px] text-sm text-muted-foreground">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
