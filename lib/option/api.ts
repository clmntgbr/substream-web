import { Option } from "./types";

export const createOption = async (
  optionData: Partial<Option>,
): Promise<Option> => {
  const response = await fetch(`/api/options`, {
    method: "POST",
    body: JSON.stringify(optionData),
  });

  if (!response.ok) {
    throw new Error("Failed to create option");
  }

  return response.json();
};
