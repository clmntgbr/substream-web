import { Option } from "../option/types";
import { Task } from "../task/types";

export interface Stream {
  id?: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  sizeInMegabytes: number | null;
  duration: string;
  audioFiles: string[];
  status: string;
  statuses: string[];
  option: Option;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  progress: number;
  processingTime: string;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isDownloadable: boolean;
  isSrtDownloadable: boolean;
  processingTimeEstimate: number;
}

export interface StreamState {
  streams: Stream[];
  currentStream: Stream | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  downloadingIds: Set<string>;
}

export type StreamAction =
  | { type: "SET_STREAMS"; payload: Stream[] }
  | { type: "SET_CURRENT_STREAM"; payload: Stream | null }
  | { type: "ADD_STREAM"; payload: Stream }
  | { type: "UPDATE_STREAM"; payload: Stream }
  | { type: "DELETE_STREAM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESHING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DOWNLOADING_START"; payload: string }
  | { type: "SET_DOWNLOADING_END"; payload: string }
  | { type: "RESET" };
