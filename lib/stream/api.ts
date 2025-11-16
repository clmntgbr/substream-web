import { Hydra } from "../hydra";
import { Stream } from "./types";

interface QueryParams {
  page?: number;
  itemsPerPage?: number;
}

export const fetchStreams = async (queryParams: QueryParams): Promise<Hydra<Stream>> => {
  const query = new URLSearchParams();

  const itemsPerPage = queryParams?.itemsPerPage || 10;
  query.append("itemsPerPage", itemsPerPage.toString());

  const response = await fetch(`/api/streams?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  return response.json();
};
