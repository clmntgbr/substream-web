import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Stream, useStreams } from "@/lib/stream";
import { useTranslations } from "@/lib/use-translations";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, CheckCheck, CheckCircle2, Clock, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { DataTableRowActions } from "./data-table-row-actions";

// Component to display and countdown remaining time
const RemainingTime = ({ estimateInSeconds }: { estimateInSeconds: number }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(estimateInSeconds);

  // Initialize with the estimate value on first render
  useEffect(() => {
    setRemainingSeconds(estimateInSeconds);
  }, []); // Only on mount

  // Update only when countdown reaches 0 and we have a new estimate
  useEffect(() => {
    if (remainingSeconds === 0 && estimateInSeconds > 0) {
      setRemainingSeconds(estimateInSeconds);
    }
  }, [estimateInSeconds, remainingSeconds]);

  // Countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Independent countdown, never resets

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return <span className="text-xs text-muted-foreground">{formatTime(remainingSeconds)} remaining</span>;
};

export const Queue = () => {
  const { state, downloadStream } = useStreams();
  const t = useTranslations();

  const columns: ColumnDef<Stream>[] = [
    {
      accessorKey: "status",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2">
            {t.stream.table.status}
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as Stream["status"];
        return (
          <Badge variant="secondary" className={`h-8 ${status} w-30`}>
            {row.original.isProcessing === true && <Timer className="size-4" />}
            {row.original.isCompleted === true && <CheckCheck className="size-4" />}
            {row.original.isFailed === true && <AlertCircle className="size-4" />}
            {t.stream.status[status as keyof typeof t.stream.status] || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "originalFileName",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2">
            {t.stream.table.fileName}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="font-medium text-foreground truncate">
                {row.original.originalFileName}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{row.original.originalFileName}</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{row.original.mimeType}</Badge>
                    <Badge variant="secondary">{row.original.sizeInMegabytes} MB</Badge>
                  </div>
                  <div className="text-muted-foreground text-xs">{row.original.createdAt.toLocaleString()}</div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "sizeInMegabytes",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2">
            {t.stream.table.size}
          </Button>
        );
      },
      cell: ({ row }) => {
        const size = parseFloat(row.getValue("sizeInMegabytes"));
        return <div className="text-muted-foreground">{size.toFixed(1)} MB</div>;
      },
    },
    {
      accessorKey: "progress",
      header: () => t.stream.table.progress,
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        const status = row.original.status;
        const estimate = row.original.processingTimeEstimate || 0;

        if (row.original.isProcessing || status === "completed") {
          return (
            <div className="space-y-2 w-[200px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{progress}%</span>
                {row.original.isProcessing && estimate > 0 && <RemainingTime estimateInSeconds={estimate} />}
              </div>
              <Progress value={progress} />
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={14} />
            <span>{t.stream.table.error}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => t.stream.table.actions,
      cell: ({ row }) => {
        return <DataTableRowActions row={row} />;
        // const status = row.original.status;
        // const streamId = row.original.id;
        // const filename = `${row.original.originalFileName || `stream-${streamId}`}.zip`;
        // const isDownloading = streamId ? state.downloadingIds.has(streamId) : false;

        // const handleDownload = () => {
        //   if (streamId) {
        //     downloadStream(streamId, filename);
        //   }
        // };

        // return (
        //   <div className="flex items-center gap-1">
        //     <div className="size-4 rounded-full"></div>
        //     {status === "completed" && (
        //       <Button variant="secondary" className="p-0 cursor-pointer" onClick={handleDownload} disabled={isDownloading}>
        //         {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        //       </Button>
        //     )}
        //   </div>
        // );
      },
    },
  ];

  const table = useReactTable({
    data: state.streams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const completedCount = state.streams.filter((s) => s.isCompleted).length;
  const processingCount = state.streams.filter((s) => s.isProcessing).length;
  const failedCount = state.streams.filter((s) => s.isFailed).length;

  return (
    <>
      {state.streams.length > 0 && (
        <div className="w-full max-w-7xl mx-auto p-6 shadow-none">
          <div className="bg-card border border-border rounded-2xl shadow-none overflow-hidden">
            <div className="p-6 border-b border-border shadow-none">
              <div className="grid grid-cols-3 gap-4 shadow-none">
                <div className="bg-card p-4 rounded-xl border border-border shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t.stream.stats.processing}</p>
                      <p className="text-2xl font-bold text-foreground">{processingCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t.stream.stats.completed}</p>
                      <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t.stream.stats.failed}</p>
                      <p className="text-2xl font-bold text-foreground">{failedCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-border p-6 shadow-none">
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-none">
                <Table>
                  <TableBody className="shadow-none">
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="shadow-none">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          {t.stream.table.noFiles}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Queue;
