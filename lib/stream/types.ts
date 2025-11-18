import { Hydra } from "../hydra";
import { Option } from "../option/types";

export interface Stream {
  id?: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  sizeInMegabytes: number | null;
  thumbnailUrl: string | null;
  duration: string;
  audioFiles: string[];
  status: string;
  statuses: string[];
  option: Option;
  createdAt: string;
  updatedAt: string;
  progress: number;
  processingTime: string;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isDownloadable: boolean;
  isSrtDownloadable: boolean;
  isResumeDownloadable: boolean;
  processingTimeEstimate: number;
}

export interface StreamState {
  streams: Hydra<Stream>;
  loading: boolean;
  error: string | null;
}

export interface StreamUrlRequestBody {
  url: string;
  optionId: string;
  name: string;
  thumbnail_file?: string;
}

export interface StreamVideoRequestBody {
  data: FormData;
}

export type StreamAction =
  | { type: "FETCH_STREAMS_SUCCESS"; payload: Hydra<Stream> }
  | { type: "FETCH_STREAMS_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_STREAMS" };
