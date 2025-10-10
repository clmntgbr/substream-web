import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Stream, useStreams } from "@/lib/stream";
import { useTranslations } from "@/lib/use-translations";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, CheckCircle2, Clock, Download } from "lucide-react";

export const Queue = () => {
  const { state } = useStreams();
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
          <Badge variant="secondary" className={`h-8 ${status}`}>
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
        return <div className="font-medium text-foreground max-w-xs truncate">{row.getValue("originalFileName")}</div>;
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

        if (row.original.isProcessing || status === "completed") {
          return (
            <div className="space-y-2 min-w-[250px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{progress}%</span>
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
        const status = row.original.status;

        return (
          <div className="flex items-center gap-1">
            {status === "completed" && (
              <Button variant="secondary" className="p-0 cursor-pointer">
                <Download className="size-4" />
              </Button>
            )}
          </div>
        );
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
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
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

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
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

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
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

        <div className="border-b border-border p-6">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
  );
};

export default Queue;
