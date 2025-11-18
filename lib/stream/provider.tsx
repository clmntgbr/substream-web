"use client";

import { useCallback, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { createStreamUrl, createStreamVideo, deleteStream, downloadResume, downloadStream, downloadSubtitle, fetchStreams } from "./api";
import { StreamContext } from "./context";
import { streamReducer } from "./reducer";
import { StreamState, StreamUrlRequestBody, StreamVideoRequestBody } from "./types";

export interface QueryParams {
  page: number;
  search?: string;
  from?: Date;
  to?: Date;
  status?: string[];
}

const initialState: StreamState = {
  streams: {
    member: [],
    totalItems: 0,
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  const useFetchStreams = useCallback(async (params: QueryParams) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const streams = await fetchStreams(params);
      dispatch({ type: "FETCH_STREAMS_SUCCESS", payload: streams });
    } catch (error) {
      dispatch({
        type: "FETCH_STREAMS_ERROR",
        payload: "Failed to fetch streams",
      });
    }
  }, []);

  const useDownloadStream = useCallback(async (id: string, fileName: string) => {
    try {
      toast.info("Stream will be downloaded shortly");
      await downloadStream(id, fileName);
      toast.success("Stream downloaded successfully");
    } catch (error) {
      toast.error("Failed to download stream");
    }
  }, []);

  const useDownloadSubtitle = useCallback(async (id: string, fileName: string) => {
    try {
      await downloadSubtitle(id, fileName);
      toast.success("Subtitle downloaded successfully");
    } catch (error) {
      toast.error("Failed to download subtitle");
    }
  }, []);

  const useDownloadResume = useCallback(async (id: string, fileName: string) => {
    try {
      await downloadResume(id, fileName);
      toast.success("Resume downloaded successfully");
    } catch (error) {
      toast.error("Failed to download resume");
    }
  }, []);

  const useCreateStreamUrl = useCallback(async (data: StreamUrlRequestBody): Promise<Response> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await createStreamUrl(data);

      const result = await response.json();

      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Video created successfully");

      return result;
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to create video");
      throw error;
    }
  }, []);

  const useCreateStreamVideo = useCallback(async (data: StreamVideoRequestBody): Promise<Response> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await createStreamVideo(data);

      const result = await response.json();

      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Stream video created successfully");

      return result;
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to create stream video");
      throw error;
    }
  }, []);

  const useDeleteStream = useCallback(async (id: string): Promise<Response> => {
    try {
      dispatch({ type: "DELETE_STREAM_OPTIMISTIC", payload: id });

      const response = await deleteStream(id);
      const result = await response.json();

      toast.success("Stream video deleted successfully");

      return result;
    } catch (error) {
      toast.error("Failed to delete stream video");
      throw error;
    }
  }, []);

  const clearStream = useCallback(() => {
    dispatch({ type: "CLEAR_STREAMS" });
  }, []);

  useEffect(() => {
    useFetchStreams({ page: 1 });
  }, [useFetchStreams]);

  return (
    <StreamContext.Provider
      value={{
        ...state,
        useFetchStreams,
        useDownloadStream,
        useDownloadSubtitle,
        useDownloadResume,
        useCreateStreamUrl,
        useCreateStreamVideo,
        useDeleteStream,
        clearStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
