import { StreamAction, StreamState } from "./types";

export const streamReducer = (state: StreamState, action: StreamAction): StreamState => {
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
    case "DELETE_STREAM_OPTIMISTIC":
      return {
        ...state,
        streams: {
          ...state.streams,
          member: state.streams.member.filter((stream) => stream.id !== action.payload),
          totalItems: Math.max(0, state.streams.totalItems - 1),
        },
      };
    default:
      return state;
  }
};
