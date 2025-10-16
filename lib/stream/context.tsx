"use client";

import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, streamReducer } from "./reducer";
import { Stream, StreamState } from "./types";

export interface StreamQueryParams {
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  search?: string;
}

interface StreamContextType {
  state: StreamState;
  getStreams: (params?: StreamQueryParams, isBackgroundRefresh?: boolean) => Promise<void>;
  getStream: (id: string) => Promise<void>;
  createStream: (streamData: Partial<Stream>) => Promise<Stream | null>;
  updateStream: (id: string, streamData: Partial<Stream>) => Promise<void>;
  deleteStream: (id: string) => Promise<void>;
  downloadStream: (id: string, filename: string) => Promise<void>;
  downloadSubtitle: (id: string, filename: string) => Promise<void>;
  downloadResume: (id: string, filename: string) => Promise<void>;
  refreshStreams: (params?: StreamQueryParams) => Promise<void>;
  totalItems: number;
  currentPage: number;
  pageCount: number;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState);
  const [totalItems, setTotalItems] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);

  const getStreams = useCallback(async (params?: StreamQueryParams, isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      dispatch({ type: "SET_REFRESHING", payload: true });
    } else {
      dispatch({ type: "SET_LOADING", payload: true });
    }
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append("page", params.page.toString());
        setCurrentPage(params.page);
      }
      if (params?.sortBy) {
        queryParams.append("sortBy", params.sortBy);
      }
      if (params?.sortOrder) {
        queryParams.append("sortOrder", params.sortOrder);
      }
      if (params?.status) {
        queryParams.append("status", params.status);
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }

      const url = `/api/streams${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as {
          streams: Stream[];
          totalItems: number;
          page: number;
          pageCount: number;
        };
        dispatch({ type: "SET_STREAMS", payload: data.streams || [] });
        setTotalItems(data.totalItems || 0);
        if (data.page) setCurrentPage(data.page);
        if (data.pageCount) setPageCount(data.pageCount);
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to fetch streams",
        });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch streams",
      });
    } finally {
      if (isBackgroundRefresh) {
        dispatch({ type: "SET_REFRESHING", payload: false });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
  }, []);

  const getStream = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`/api/streams/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as { stream: Stream };
        dispatch({ type: "SET_CURRENT_STREAM", payload: data.stream });
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to fetch stream",
        });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch stream",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createStream = useCallback(async (streamData: Partial<Stream>) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/streams/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(streamData),
      });

      if (response.ok) {
        const data = (await response.json()) as { stream: Stream };
        dispatch({ type: "ADD_STREAM", payload: data.stream });
        return data.stream;
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to create stream",
        });
        return null;
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to create stream",
      });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateStream = useCallback(async (id: string, streamData: Partial<Stream>) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`/api/streams/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/ld+json",
        },
        credentials: "include",
        body: JSON.stringify(streamData),
      });

      if (response.ok) {
        const data = (await response.json()) as { stream: Stream };
        dispatch({ type: "UPDATE_STREAM", payload: data.stream });
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to update stream",
        });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update stream",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const deleteStream = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`/api/streams/${id}/delete`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        dispatch({ type: "DELETE_STREAM", payload: id });
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to delete stream",
        });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to delete stream",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const downloadStream = useCallback(async (id: string, filename: string) => {
    dispatch({ type: "SET_DOWNLOADING_START", payload: id });

    toast.info("Download starting", {
      description: "Preparing your file for download...",
    });

    try {
      const response = await fetch(`/api/streams/${id}/download`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const errorMessage = errorData.message || errorData.error || `Download failed with status ${response.status}`;

        toast.error("Download failed", {
          description: errorMessage,
        });

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
        return;
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const downloadFilename = contentDisposition ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") : filename;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download completed", {
        description: "Your file has been downloaded successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to download stream";

      toast.error("Download failed", {
        description: errorMessage,
      });

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    } finally {
      dispatch({ type: "SET_DOWNLOADING_END", payload: id });
    }
  }, []);

  const downloadSubtitle = useCallback(async (id: string, filename: string) => {
    dispatch({ type: "SET_DOWNLOADING_START", payload: id });

    toast.info("Download starting", {
      description: "Preparing your subtitle for download...",
    });

    try {
      const response = await fetch(`/api/streams/${id}/download/subtitle`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const errorMessage = errorData.message || errorData.error || `Download failed with status ${response.status}`;

        toast.error("Download failed", {
          description: errorMessage,
        });

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
        return;
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const downloadFilename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : filename.replace(/\.[^/.]+$/, ".srt");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download completed", {
        description: "Your subtitle has been downloaded successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to download subtitle";

      toast.error("Download failed", {
        description: errorMessage,
      });

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    } finally {
      dispatch({ type: "SET_DOWNLOADING_END", payload: id });
    }
  }, []);

  const downloadResume = useCallback(async (id: string, filename: string) => {
    dispatch({ type: "SET_DOWNLOADING_START", payload: id });

    toast.info("Download starting", {
      description: "Preparing your resume for download...",
    });

    try {
      const response = await fetch(`/api/streams/${id}/download/resume`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const errorMessage = errorData.message || errorData.error || `Download failed with status ${response.status}`;

        toast.error("Download failed", {
          description: errorMessage,
        });

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
        return;
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const downloadFilename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : filename.replace(/\.[^/.]+$/, ".txt");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download completed", {
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to download resume";

      toast.error("Download failed", {
        description: errorMessage,
      });

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    } finally {
      dispatch({ type: "SET_DOWNLOADING_END", payload: id });
    }
  }, []);

  const refreshStreams = useCallback(
    async (params?: StreamQueryParams) => {
      await getStreams(params);
    },
    [getStreams]
  );

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  return (
    <StreamContext.Provider
      value={{
        state,
        getStreams,
        getStream,
        createStream,
        updateStream,
        deleteStream,
        downloadStream,
        downloadSubtitle,
        downloadResume,
        refreshStreams,
        totalItems,
        currentPage,
        pageCount,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

export function useStreams() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStreams must be used within a StreamProvider");
  }
  return context;
}
