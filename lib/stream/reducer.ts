import { StreamAction, StreamState } from "./types";

// Initial state
export const initialState: StreamState = {
  streams: [],
  currentStream: null,
  isLoading: false,
  error: null,
  downloadingIds: new Set(),
};

// Reducer function
export function streamReducer(
  state: StreamState,
  action: StreamAction,
): StreamState {
  switch (action.type) {
    case "SET_STREAMS":
      return {
        ...state,
        streams: action.payload,
        error: null,
      };
    case "SET_CURRENT_STREAM":
      return {
        ...state,
        currentStream: action.payload,
        error: null,
      };
    case "ADD_STREAM":
      return {
        ...state,
        streams: [action.payload, ...state.streams],
        error: null,
      };
    case "UPDATE_STREAM":
      return {
        ...state,
        streams: state.streams.map((stream) =>
          stream.id === action.payload.id ? action.payload : stream,
        ),
        currentStream:
          state.currentStream?.id === action.payload.id
            ? action.payload
            : state.currentStream,
        error: null,
      };
    case "DELETE_STREAM":
      return {
        ...state,
        streams: state.streams.filter((stream) => stream.id !== action.payload),
        currentStream:
          state.currentStream?.id === action.payload
            ? null
            : state.currentStream,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "SET_DOWNLOADING_START":
      return {
        ...state,
        downloadingIds: new Set([...state.downloadingIds, action.payload]),
      };
    case "SET_DOWNLOADING_END":
      const newDownloadingIds = new Set(state.downloadingIds);
      newDownloadingIds.delete(action.payload);
      return {
        ...state,
        downloadingIds: newDownloadingIds,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
