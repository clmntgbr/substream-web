import { User } from "./types";

export const fetchMe = async (): Promise<User> => {
  const response = await fetch("/api/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};
