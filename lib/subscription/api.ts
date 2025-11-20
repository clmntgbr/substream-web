import { Subscription } from "./types";

export const getSubscription = async (): Promise<Subscription> => {
  const response = await fetch(`/api/subscription`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription");
  }

  return response.json();
};
