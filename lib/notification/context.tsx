"use client";

import { apiClient } from "@/lib/api-client";
import { usePathname } from "next/navigation";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, notificationReducer } from "./reducer";
import { Notification, NotificationState } from "./types";

export interface NotificationSearchParams {
  statusFilter?: string[];
  page?: number;
  itemsPerPage?: number;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface NotificationContextType {
  state: NotificationState;
  searchNotifications: (params?: NotificationSearchParams) => Promise<void>;
  refreshNotifications: (params?: NotificationSearchParams) => Promise<void>;
  markReadNotification: (id: string) => Promise<void>;
  totalItems: number;
  currentPage: number;
  pageCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [totalItems, setTotalItems] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const pathname = usePathname();

  const searchNotifications = useCallback(async (params?: NotificationSearchParams) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const queryParams = new URLSearchParams();

      const page = params?.page || 1;
      queryParams.append("page", page.toString());
      setCurrentPage(page);

      const itemsPerPage = params?.itemsPerPage || 10;
      queryParams.append("itemsPerPage", itemsPerPage.toString());

      if (params?.statusFilter && params.statusFilter.length > 0) {
        params.statusFilter.forEach((filter) => {
          queryParams.append("statusFilter[]", filter);
        });
      }

      queryParams.append("statusFilter[]", "!deleted");

      if (params?.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }

      if (params?.fromDate) {
        queryParams.append("createdAt[after]", params.fromDate.toISOString());
      }

      if (params?.toDate) {
        // Add one day to include the entire selected day
        const toDatePlusOne = new Date(params.toDate);
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);
        queryParams.append("createdAt[before]", toDatePlusOne.toISOString());
      }

      const response = await apiClient.get(`/api/search/notifications?${queryParams.toString()}`);

      if (response.ok) {
        const data = (await response.json()) as {
          notifications: Notification[];
          totalItems: number;
          page: number;
          pageCount: number;
        };

        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: data.notifications || [],
        });

        setTotalItems(data.totalItems || 0);
        setPageCount(data.pageCount || 1);
      } else {
        const errorData = (await response.json()) as { error?: string };
        dispatch({
          type: "SET_ERROR",
          payload: errorData.error || "Failed to search notifications",
        });
        toast.error("Search failed", {
          description: errorData.error || "Failed to search notifications",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to search notifications";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      toast.error("Search failed", {
        description: errorMessage,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const refreshNotifications = useCallback(
    async (params?: NotificationSearchParams) => {
      await searchNotifications(params);
    },
    [searchNotifications]
  );

  const markReadNotification = useCallback(async (id: string) => {
    try {
      const response = await apiClient.patch(
        `/api/notifications/${id}/read`,
        { isRead: true },
        { headers: { "Content-Type": "application/merge-patch+json" } }
      );

      if (response.ok) {
        dispatch({ type: "MARK_READ_NOTIFICATION", payload: id });
      } else {
        const errorData = (await response.json()) as { error?: string };
        toast.error("Failed to mark notification as read", {
          description: errorData.error || "An error occurred",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark notification as read";
      toast.error("Failed to mark notification as read", {
        description: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    // Don't load notifications on public routes
    const isPublicRoute =
      pathname?.endsWith("/login") ||
      pathname?.endsWith("/register") ||
      pathname?.endsWith("/pricing") ||
      pathname?.endsWith("/reset") ||
      pathname?.includes("/oauth");

    if (!isPublicRoute) {
      searchNotifications();
    }
  }, [searchNotifications, pathname]);

  return (
    <NotificationContext.Provider
      value={{
        state,
        searchNotifications,
        refreshNotifications,
        markReadNotification,
        totalItems,
        currentPage,
        pageCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
