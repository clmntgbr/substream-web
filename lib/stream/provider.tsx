"use client";

import { useCallback, useEffect, useReducer } from "react";
import { fetchStreams } from "./api";
import { StreamContext } from "./context";
import { streamReducer } from "./reducer";
import { StreamState } from "./types";

interface QueryParams {
  page?: number;
  itemsPerPage?: number;
}

const initialState: StreamState = {
  streams: {
    member: [],
    totalItems: 0,
  },
  loading: false,
  error: null,
};

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  const useFetchStreams = useCallback(async (params: QueryParams = { itemsPerPage: 2 }) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const streams = await fetchStreams(params);
      dispatch({ type: "FETCH_STREAMS_SUCCESS", payload: streams });
    } catch (error) {
      dispatch({ type: "FETCH_STREAMS_ERROR", payload: "Failed to fetch streams" });
    }
  }, []);

  const clearStream = useCallback(() => {
    dispatch({ type: "CLEAR_STREAMS" });
  }, []);

  useEffect(() => {
    useFetchStreams();
  }, [useFetchStreams]);

  return (
    <StreamContext.Provider
      value={{
        ...state,
        useFetchStreams,
        clearStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
