import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stream, useStreams } from "@/lib/stream";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, CheckCircle2, Clock, Download } from "lucide-react";

export const Queue = () => {
  const { state } = useStreams();

  const columns: ColumnDef<Stream>[] = [
    {
      accessorKey: "status",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2 hover:bg-slate-100">
            Status
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as Stream["status"];
        return (
          <Badge variant="secondary" className="capitalize h-8">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "originalFileName",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2 hover:bg-slate-100">
            File Name
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium text-slate-800 max-w-xs truncate">{row.getValue("originalFileName")}</div>;
      },
    },
    {
      accessorKey: "sizeInMegabytes",
      header: () => {
        return (
          <Button variant="ghost" className="h-8 px-2 hover:bg-slate-100">
            Size
          </Button>
        );
      },
      cell: ({ row }) => {
        const size = parseFloat(row.getValue("sizeInMegabytes"));
        return <div className="text-slate-600">{size.toFixed(1)} MB</div>;
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        const status = row.original.status;

        if (status === "failed") {
          return (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={14} />
              <span>Error</span>
            </div>
          );
        }

        if (status === "completed") {
          return (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle2 size={14} />
              Complete
            </div>
          );
        }

        return (
          <div className="space-y-2 min-w-[250px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Processing</p>
                  <p className="text-2xl font-bold text-slate-900">{processingCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Failed</p>
                  <p className="text-2xl font-bold text-slate-900">{failedCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
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
                      No files in queue.
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
