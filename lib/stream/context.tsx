"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "sonner";
import { initialState, streamReducer } from "./reducer";
import { Stream, StreamState } from "./types";

// Context type
interface StreamContextType {
  state: StreamState;
  getStreams: () => Promise<void>;
  getStream: (id: string) => Promise<void>;
  createStream: (streamData: Partial<Stream>) => Promise<Stream | null>;
  updateStream: (id: string, streamData: Partial<Stream>) => Promise<void>;
  deleteStream: (id: string) => Promise<void>;
  downloadStream: (id: string, filename: string) => Promise<void>;
  refreshStreams: () => Promise<void>;
}

// Create context
const StreamContext = createContext<StreamContextType | undefined>(undefined);

// Provider component
export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  const getStreams = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/streams", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as { streams: Stream[] };
        dispatch({ type: "SET_STREAMS", payload: data.streams || [] });
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
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Get single stream
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

  // Create stream
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

  // Update stream
  const updateStream = useCallback(
    async (id: string, streamData: Partial<Stream>) => {
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
    },
    [],
  );

  // Delete stream
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

  // Download stream
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
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Download failed with status ${response.status}`;

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
        : filename;

      // Create blob and download
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to download stream";

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

  // Refresh streams
  const refreshStreams = useCallback(async () => {
    await getStreams();
  }, [getStreams]);

  // Load streams on mount and refresh every 20 seconds
  useEffect(() => {
    getStreams();

    const interval = setInterval(() => {
      getStreams();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
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
        refreshStreams,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

// Custom hook to use the stream context
export function useStreams() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStreams must be used within a StreamProvider");
  }
  return context;
}
