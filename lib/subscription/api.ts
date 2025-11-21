import {
  CreateSubscriptionRequestBody,
  GetSubscriptionPreviewRequestBody,
  GetSubscriptionUpdatePreviewResponse,
  Subscription,
  UpdateSubscriptionRequestBody,
} from "./types";

export const getSubscription = async (): Promise<Subscription> => {
  const response = await fetch(`/api/subscription`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription");
  }

  return response.json();
};

export const createSubsription = async (data: CreateSubscriptionRequestBody): Promise<{ url?: string }> => {
  const response = await fetch(`/api/subscription/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription create");
  }

  return response.json();
};

export const getSubscriptionUpdatePreview = async (data: GetSubscriptionPreviewRequestBody): Promise<GetSubscriptionUpdatePreviewResponse> => {
  const response = await fetch(`/api/subscription/update/preview`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription preview");
  }

  return response.json();
};

export const updateSubsription = async (data: UpdateSubscriptionRequestBody): Promise<void> => {
  const response = await fetch(`/api/subscription/update`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription update");
  }
};

export const getSubscriptionManage = async (): Promise<{ url?: string }> => {
  const response = await fetch(`/api/subscription/manage`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription manage");
  }

  return response.json();
};
