"use client";

import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { MercureMessage, useMercure } from "@/lib/mercure";
import { useErrorTranslator } from "@/lib/use-error-translator";
import { useGetTranslation } from "@/lib/use-get-translation";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { initialState, notificationReducer } from "./reducer";
import { Notification, NotificationState } from "./types";

export interface NotificationSearchParams {
  page?: number;
  itemsPerPage?: number;
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
  const { user } = useAuth();
  const { resolveErrorMessage, parseErrorPayload, getDefaultErrorMessage } = useErrorTranslator();
  const getTranslation = useGetTranslation();

  const lastSearchParamsRef = React.useRef<NotificationSearchParams | undefined>(undefined);

  const searchNotifications = useCallback(
    async (params?: NotificationSearchParams) => {
      dispatch({ type: "SET_LOADING", payload: true });
      lastSearchParamsRef.current = params;

      try {
        const queryParams = new URLSearchParams();

        const page = params?.page || 1;
        queryParams.append("page", page.toString());
        setCurrentPage(page);

        const itemsPerPage = params?.itemsPerPage || 10;
        queryParams.append("itemsPerPage", itemsPerPage.toString());

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
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
            message?: string;
            key?: string;
            params?: Record<string, unknown>;
          };
          const parsedError = parseErrorPayload(errorData);
          const resolvedMessage = resolveErrorMessage(
            {
              ...parsedError,
              message: parsedError.message ?? errorData.message,
              error: parsedError.error ?? errorData.error,
              params: parsedError.params ?? errorData.params,
            },
            errorData.error || "Failed to search notifications"
          );
          dispatch({
            type: "SET_ERROR",
            payload: resolvedMessage,
          });
          toast.error(getTranslation("error.notification.search_failed"), {
            description: resolvedMessage,
          });
        }
      } catch (error: unknown) {
        const backendError = error as (Error & { key?: string; params?: Record<string, unknown> }) | undefined;
        const message = resolveErrorMessage(
          {
            key: backendError?.key,
            params: backendError?.params,
            message: backendError instanceof Error ? backendError.message : undefined,
          },
          backendError instanceof Error ? backendError.message : getDefaultErrorMessage()
        );
        dispatch({
          type: "SET_ERROR",
          payload: message,
        });
        toast.error(getTranslation("error.notification.search_failed"), {
          description: message,
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [getTranslation]
  );

  const refreshNotifications = useCallback(
    async (params?: NotificationSearchParams) => {
      await searchNotifications(params);
    },
    [searchNotifications]
  );

  const markReadNotification = useCallback(
    async (id: string) => {
      try {
        const response = await apiClient.patch(
          `/api/notifications/${id}/read`,
          { isRead: true },
          { headers: { "Content-Type": "application/merge-patch+json" } }
        );

        if (response.ok) {
          dispatch({ type: "MARK_READ_NOTIFICATION", payload: id });
        } else {
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
            message?: string;
            key?: string;
            params?: Record<string, unknown>;
          };
          const parsedError = parseErrorPayload(errorData);
          const resolvedMessage = resolveErrorMessage(
            {
              ...parsedError,
              message: parsedError.message ?? errorData.message,
              error: parsedError.error ?? errorData.error,
              params: parsedError.params ?? errorData.params,
            },
            errorData.error || "Failed to mark notification as read"
          );
          toast.error(getTranslation("error.notification.failed_to_mark_as_read"), {
            description: resolvedMessage,
          });
        }
      } catch (error: unknown) {
        const backendError = error as (Error & { key?: string; params?: Record<string, unknown> }) | undefined;
        const message = resolveErrorMessage(
          {
            key: backendError?.key,
            params: backendError?.params,
            message: backendError instanceof Error ? backendError.message : undefined,
          },
          backendError instanceof Error ? backendError.message : getDefaultErrorMessage()
        );
        toast.error(getTranslation("error.notification.failed_to_mark_as_read"), {
          description: message,
        });
      }
    },
    [getTranslation]
  );

  const handleMercureMessage = useCallback(
    (message: MercureMessage) => {
      const notificationData = message.data as Notification;

      switch (message.type) {
        case "notification.created":
          searchNotifications(lastSearchParamsRef.current);
          break;

        case "notification.updated":
          if (notificationData.id) {
            dispatch({
              type: "MARK_READ_NOTIFICATION",
              payload: notificationData.id,
            });
          }
          break;

        case "notifications.refresh":
          searchNotifications(lastSearchParamsRef.current);
          break;

        default:
      }
    },
    [searchNotifications]
  );

  const mercureTopics = React.useMemo(() => {
    return user?.id ? [`/users/${user.id}/search/notifications`] : [];
  }, [user?.id]);

  const handleMercureError = useCallback(() => {}, []);
  const handleMercureOpen = useCallback(() => {}, []);

  useMercure({
    topics: mercureTopics,
    onMessage: handleMercureMessage,
    onError: handleMercureError,
    onOpen: handleMercureOpen,
    enabled: true,
  });

  useEffect(() => {
    searchNotifications();
  }, [searchNotifications]);

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
