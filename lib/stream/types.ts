import { Option } from "../option/types";
import { Task } from "../task/types";

export interface Stream {
  id?: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  audioFiles: string[];
  status: string;
  statuses: string[];
  option: Option;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  processingTime: string;
  [key: string]: unknown;
}

export interface StreamState {
  streams: Stream[];
  currentStream: Stream | null;
  isLoading: boolean;
  error: string | null;
}

export type StreamAction =
  | { type: "SET_STREAMS"; payload: Stream[] }
  | { type: "SET_CURRENT_STREAM"; payload: Stream | null }
  | { type: "ADD_STREAM"; payload: Stream }
  | { type: "UPDATE_STREAM"; payload: Stream }
  | { type: "DELETE_STREAM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };
