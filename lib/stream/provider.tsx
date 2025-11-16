"use client";

import { useCallback, useEffect, useReducer } from "react";
import { downloadStream, fetchStreams } from "./api";
import { StreamContext } from "./context";
import { streamReducer } from "./reducer";
import { StreamState } from "./types";

export interface QueryParams {
  page: number;
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
      dispatch({ type: "FETCH_STREAMS_ERROR", payload: "Failed to fetch streams" });
    }
  }, []);

  const useDownloadStream = useCallback(async (id: string, fileName: string) => {
    try {
      await downloadStream(id, fileName);
      dispatch({ type: "DOWNLOAD_STREAM_SUCCESS" });
    } catch (error) {
      dispatch({ type: "DOWNLOAD_STREAM_ERROR", payload: "Failed to download stream" });
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
        clearStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
