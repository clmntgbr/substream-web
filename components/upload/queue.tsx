"use client";

import { useStreams } from "@/lib/stream/context";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";

export const Queue = () => {
  const { state } = useStreams();

  return (
    <>
      <div className="container mx-auto bg-card border border-border rounded-lg">
        {/* Queue Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Upload Queue</h3>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-muted-foreground">Completed: {state.streams?.filter((stream) => stream.isCompleted).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Processing: {state.streams?.filter((stream) => stream.isProcessing).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-muted-foreground">Errors: {state.streams?.filter((stream) => stream.isFailed).length}</span>
            </div>
          </div>
        </div>
        {/* File List */}
        <div className="">
          {state.streams?.map((file) => (
            <div key={file?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors duration-200">
              <div className="flex items-start gap-3">
                {/* File Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Upload size={20} className={`text-blue-600`} />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate pr-2">{file?.originalFileName}</h4>
                    <div className="flex items-center gap-2">
                      {file?.status === "uploading" && <Button variant="ghost" onClick={() => {}} />}
                      {file?.status === "paused" && <Button variant="ghost" onClick={() => {}} />}
                      <Button variant="ghost" onClick={() => {}} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{file?.sizeInMegabytes} MB</span>
                    <span className="capitalize">{file?.status}</span>
                  </div>

                  {/* Progress Bar */}
                  {(file?.status === "uploading" || file?.status === "processing") && (
                    <div className="mb-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            file?.status === "uploading" ? "bg-blue-600" : "bg-purple-600"
                          }`}
                          style={{ width: `${0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Status Details */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {file?.status === "uploading" && `${0}% uploaded`}
                      {file?.status === "processing" && `${0}% processed`}
                      {file?.status === "completed" && "Ready for download"}
                      {file?.status === "error" && "Error"}
                      {file?.status === "paused" && "Upload paused"}
                      {file?.status === "queued" && "Waiting in queue"}
                    </span>

                    {0 && file?.status === "uploading" && <span className="text-muted-foreground">{0} remaining</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Queue;
