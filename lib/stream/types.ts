import { Hydra } from "../hydra";

export interface Stream {
  id?: string;
}

export interface StreamState {
  streams: Hydra<Stream>;
  loading: boolean;
  error: string | null;
}

export type StreamAction =
  | { type: "FETCH_STREAMS_SUCCESS"; payload: Hydra<Stream> }
  | { type: "FETCH_STREAMS_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_STREAMS" };
