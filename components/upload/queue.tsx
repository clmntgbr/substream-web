import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { AlertCircle, CheckCircle2, Clock, Download, Pause, Upload } from "lucide-react";
import { useState } from "react";

interface Stream {
  id: string;
  originalFileName: string;
  sizeInMegabytes: number;
  status: "queued" | "uploading" | "processing" | "completed" | "error" | "paused";
  progress: number;
  uploadSpeed?: number;
  timeRemaining?: number;
  isCompleted: boolean;
  isProcessing: boolean;
  isFailed: boolean;
  errorMessage?: string;
}

const mockStreams: Stream[] = [
  {
    id: "1",
    originalFileName: "presentation_final_v3.mp4",
    sizeInMegabytes: 245.8,
    status: "completed",
    progress: 100,
    isCompleted: true,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "2",
    originalFileName: "conference_keynote_2024.mp4",
    sizeInMegabytes: 512.3,
    status: "processing",
    progress: 67,
    isCompleted: false,
    isProcessing: true,
    isFailed: false,
  },
  {
    id: "3",
    originalFileName: "tutorial_advanced_techniques.mp4",
    sizeInMegabytes: 892.1,
    status: "uploading",
    progress: 42,
    uploadSpeed: 12.5,
    timeRemaining: 480,
    isCompleted: false,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "4",
    originalFileName: "webinar_recording_Q1.mp4",
    sizeInMegabytes: 156.7,
    status: "paused",
    progress: 28,
    isCompleted: false,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "5",
    originalFileName: "product_demo_extended.mp4",
    sizeInMegabytes: 387.2,
    status: "error",
    progress: 0,
    isCompleted: false,
    isProcessing: false,
    isFailed: true,
    errorMessage: "Network connection lost",
  },
  {
    id: "6",
    originalFileName: "training_module_01.mp4",
    sizeInMegabytes: 672.9,
    status: "queued",
    progress: 0,
    isCompleted: false,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "7",
    originalFileName: "interview_highlights.mp4",
    sizeInMegabytes: 198.4,
    status: "completed",
    progress: 100,
    isCompleted: true,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "8",
    originalFileName: "marketing_campaign_video.mp4",
    sizeInMegabytes: 445.6,
    status: "uploading",
    progress: 78,
    uploadSpeed: 15.2,
    timeRemaining: 120,
    isCompleted: false,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "9",
    originalFileName: "customer_testimonials_2024.mp4",
    sizeInMegabytes: 324.1,
    status: "completed",
    progress: 100,
    isCompleted: true,
    isProcessing: false,
    isFailed: false,
  },
  {
    id: "10",
    originalFileName: "annual_report_presentation.mp4",
    sizeInMegabytes: 589.3,
    status: "processing",
    progress: 33,
    isCompleted: false,
    isProcessing: true,
    isFailed: false,
  },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getStatusIcon = (status: Stream["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="text-green-600" size={18} />;
    case "uploading":
      return <Upload className="text-blue-600" size={18} />;
    case "processing":
      return <Upload className="text-purple-600" size={18} />;
    case "error":
      return <AlertCircle className="text-red-600" size={18} />;
    case "paused":
      return <Pause className="text-orange-600" size={18} />;
    case "queued":
      return <Clock className="text-slate-500" size={18} />;
  }
};

const getStatusBadgeVariant = (status: Stream["status"]): "success" | "error" | "warning" | "info" | "secondary" => {
  switch (status) {
    case "completed":
      return "success";
    case "error":
      return "error";
    case "uploading":
      return "info";
    case "processing":
      return "info";
    case "paused":
      return "warning";
    case "queued":
      return "secondary";
  }
};

const getProgressVariant = (status: Stream["status"]): "success" | "info" | "warning" | "error" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "uploading":
      return "info";
    case "processing":
      return "info";
    case "paused":
      return "warning";
    case "error":
      return "error";
    default:
      return "default";
  }
};

export const Queue = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
          <Badge variant="secondary" className="capitalize">
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
        const uploadSpeed = row.original.uploadSpeed;
        const timeRemaining = row.original.timeRemaining;

        if (status === "queued") {
          return <span className="text-sm text-slate-500">Waiting...</span>;
        }

        if (status === "error") {
          return (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={14} />
              <span>{row.original.errorMessage}</span>
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
          <div className="space-y-2 min-w-[200px]">
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
    data: mockStreams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const completedCount = mockStreams.filter((s) => s.isCompleted).length;
  const processingCount = mockStreams.filter((s) => s.isProcessing).length;
  const failedCount = mockStreams.filter((s) => s.isFailed).length;
  const uploadingCount = mockStreams.filter((s) => s.status === "uploading").length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Uploading</p>
                  <p className="text-2xl font-bold text-slate-900">{uploadingCount}</p>
                </div>
              </div>
            </div>

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
