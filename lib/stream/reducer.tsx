import { StreamAction, StreamState } from "./types";

export const streamReducer = (
  state: StreamState,
  action: StreamAction,
): StreamState => {
  switch (action.type) {
    case "FETCH_STREAMS_SUCCESS":
      return {
        ...state,
        streams: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_STREAMS_ERROR":
      return {
        ...state,
        streams: {
          member: [],
          totalItems: 0,
          currentPage: 0,
          itemsPerPage: 0,
          totalPages: 0,
        },
        loading: false,
        error: action.payload,
      };
    case "DOWNLOAD_STREAM_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "DOWNLOAD_STREAM_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "CLEAR_STREAMS":
      return {
        ...state,
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
    default:
      return state;
  }
};
