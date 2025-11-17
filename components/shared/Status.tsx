"use client";

import { Stream } from "@/lib/stream/types";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface StatusProps {
  stream: Stream;
}

export default function Status({ stream }: StatusProps) {
  return (
    <>
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 cursor-pointer w-full border-b-0 border-l-0 border-r-0 py-2 rounded-none text-sm"
      >
        {stream.isCompleted && (
          <>
            <CheckCircle2Icon className="size-4 text-emerald-400" />
            {stream.status}
          </>
        )}
        {stream.isFailed && (
          <>
            <XCircleIcon className="size-4 text-red-500" /> {stream.status}
          </>
        )}
        {stream.isProcessing && (
          <>
            <Loader2Icon className="size-4 animate-spin text-blue-400" />
            {stream.status}
          </>
        )}
      </Badge>
    </>
  );
}
