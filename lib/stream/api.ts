import { Hydra } from "../hydra";
import { Stream } from "./types";

interface QueryParams {
  page: number;
}

export const fetchStreams = async (queryParams: QueryParams): Promise<Hydra<Stream>> => {
  const query = new URLSearchParams();

  query.append("itemsPerPage", "2");
  query.append("page", queryParams.page.toString());

  console.log(query.toString());
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
