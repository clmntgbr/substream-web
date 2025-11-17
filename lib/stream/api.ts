import { Hydra } from "../hydra";
import { QueryParams } from "./provider";
import { Stream } from "./types";

export const fetchStreams = async (queryParams: QueryParams): Promise<Hydra<Stream>> => {
  const query = new URLSearchParams();

  query.append("itemsPerPage", "10");
  query.append("page", queryParams.page.toString());

  if (queryParams.search) {
    query.append("originalFileName", queryParams.search);
  }

  if (queryParams.from) {
    query.append("createdAt[after]", queryParams.from.toISOString());
  }

  if (queryParams.to) {
    query.append("createdAt[before]", queryParams.to.toISOString());
  }

  const response = await fetch(`/api/streams?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  return response.json();
};

export const downloadStream = async (id: string, fileName: string): Promise<void> => {
  const response = await fetch(`/api/streams/${id}/download`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download stream");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadSubtitle = async (id: string, fileName: string): Promise<void> => {
  const response = await fetch(`/api/streams/${id}/download/subtitle`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download subtitle");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.srt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadResume = async (id: string, fileName: string): Promise<void> => {
  const response = await fetch(`/api/streams/${id}/download/resume`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download resume");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
