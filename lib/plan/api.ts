import { Hydra } from "../hydra";
import { Plan } from "./types";

export const fetchPlans = async (): Promise<Plan[]> => {
  const response = await fetch(`/api/plans`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  return response.json();
};
