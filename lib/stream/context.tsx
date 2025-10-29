"use client";

import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { MercureMessage, useMercure } from "@/lib/mercure";
import { usePathname } from "next/navigation";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, streamReducer } from "./reducer";
import { Stream, StreamState } from "./types";

export interface StreamSearchParams {
  statusFilter?: string[];
  page?: number;
  itemsPerPage?: number;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface StreamContextType {
  state: StreamState;
  searchStreams: (params?: StreamSearchParams) => Promise<void>;
  getStream: (id: string) => Promise<void>;
  createStream: (streamData: Partial<Stream>) => Promise<Stream | null>;
  updateStream: (id: string, streamData: Partial<Stream>) => Promise<void>;
  deleteStream: (id: string) => Promise<void>;
  downloadStream: (id: string, filename: string) => Promise<void>;
  downloadSubtitle: (id: string, filename: string) => Promise<void>;
  downloadResume: (id: string, filename: string) => Promise<void>;
  getResume: (id: string) => Promise<string | null>;
  refreshStreams: (params?: StreamSearchParams) => Promise<void>;
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
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const { user } = useAuth();

  const isPublicRoute =
    pathname?.endsWith("/login") ||
    pathname?.endsWith("/register") ||
    pathname?.endsWith("/pricing") ||
    pathname?.endsWith("/reset") ||
    pathname?.includes("/oauth");

  const searchStreamsRef = React.useRef<((params?: StreamSearchParams) => Promise<void>) | null>(null);

  const handleMercureMessage = useCallback((message: MercureMessage) => {
    switch (message.type) {
      case "streams.refresh":
        if (searchStreamsRef.current) {
          searchStreamsRef.current();
        }
        break;

      default:
        console.log("Unknown Mercure message type:", message.type);
    }
  }, []);

  // Build user-specific topic: /users/{userId}/search/streams
  const mercureTopic = user?.id ? `/users/${user.id}/search/streams` : null;

  useMercure({
    topics: mercureTopic ? [mercureTopic] : [],
    onMessage: handleMercureMessage,
    onError: () => {},
    onOpen: () => {},
    enabled: !isPublicRoute && isAuthenticated && !!mercureTopic,
  });

  const searchStreams = useCallback(async (params?: StreamSearchParams) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const queryParams = new URLSearchParams();

      const page = params?.page || 1;
      queryParams.append("page", page.toString());
      setCurrentPage(page);

      const itemsPerPage = params?.itemsPerPage || 10;
      queryParams.append("itemsPerPage", itemsPerPage.toString());

      if (params?.statusFilter && params.statusFilter.length > 0) {
        params.statusFilter.forEach((filter) => {
          queryParams.append("statusFilter[]", filter);
        });
      }

      queryParams.append("statusFilter[]", "!deleted");

      if (params?.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }

      if (params?.fromDate) {
        queryParams.append("createdAt[after]", params.fromDate.toISOString());
      }

      if (params?.toDate) {
        const toDatePlusOne = new Date(params.toDate);
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);
        queryParams.append("createdAt[before]", toDatePlusOne.toISOString());
      }

      const response = await apiClient.get(`/api/search/streams?${queryParams.toString()}`);

      if (response.ok) {
        const data = (await response.json()) as {
          streams: Stream[];
          totalItems: number;
          page: number;
          pageCount: number;
        };

        dispatch({
          type: "SET_STREAMS",
          payload: data.streams || [],
        });

        setTotalItems(data.totalItems || 0);
        setPageCount(data.pageCount || 1);
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to search streams",
        });
        toast.error("Search failed", {
          description: errorData.error || "Failed to search streams",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to search streams";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      toast.error("Search failed", {
        description: errorMessage,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const getStream = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiClient.get(`/api/streams/${id}`);

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
      const response = await apiClient.post("/api/streams/video", streamData);

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
      const response = await apiClient.put(`/api/streams/${id}`, streamData, {
        headers: {
          "Content-Type": "application/ld+json",
        },
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
      const response = await apiClient.get(`/api/streams/${id}/delete`);

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
      const response = await apiClient.get(`/api/streams/${id}/download`);

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
      const response = await apiClient.get(`/api/streams/${id}/download/subtitle`);

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
      const response = await apiClient.get(`/api/streams/${id}/download/resume`);

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

  const getResume = useCallback(async (id: string): Promise<string | null> => {
    try {
      const response = await apiClient.get(`/api/streams/${id}/download/resume`);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const errorMessage = errorData.message || errorData.error || `Failed to get resume with status ${response.status}`;

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
        return null;
      }

      const blob = await response.blob();
      const text = await blob.text();
      return text;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get resume";

      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return null;
    }
  }, []);

  const refreshStreams = useCallback(
    async (params?: StreamSearchParams) => {
      await searchStreams(params);
    },
    [searchStreams]
  );

  React.useEffect(() => {
    searchStreamsRef.current = searchStreams;
  }, [searchStreams]);

  useEffect(() => {
    if (!isPublicRoute) {
      searchStreams().then(() => {
        setIsAuthenticated(true);
      });
    }
  }, [searchStreams, pathname, isPublicRoute]);

  return (
    <StreamContext.Provider
      value={{
        state,
        searchStreams,
        getStream,
        createStream,
        updateStream,
        deleteStream,
        downloadStream,
        downloadSubtitle,
        downloadResume,
        getResume,
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
