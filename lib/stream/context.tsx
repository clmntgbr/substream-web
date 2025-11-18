"use client";

import { createContext, useContext } from "react";
import { QueryParams } from "./provider";
import { StreamState, StreamUrlRequestBody, StreamVideoRequestBody } from "./types";

export interface StreamContextType extends StreamState {
  useFetchStreams: (params: QueryParams) => Promise<void>;
  useDownloadStream: (id: string, fileName: string) => Promise<void>;
  useDownloadSubtitle: (id: string, fileName: string) => Promise<void>;
  useDownloadResume: (id: string, fileName: string) => Promise<void>;
  useCreateStreamUrl: (data: StreamUrlRequestBody) => Promise<Response>;
  useCreateStreamVideo: (data: StreamVideoRequestBody) => Promise<Response>;
  clearStream: () => void;
}

export const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStreams = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within StreamProvider");
  }
  return context;
};
