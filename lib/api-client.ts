import { toast } from "sonner";
import { getTranslation } from "./get-translation";

interface ApiResponse<T = unknown> extends Response {
  json(): Promise<T>;
}

interface ApiClientOptions extends RequestInit {
  skipAuthRedirect?: boolean;
}

class ApiClient {
  private baseUrl: string = "";

  async request<T = unknown>(
    url: string,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    const { skipAuthRedirect, ...fetchOptions } = options;

    try {
      const response = await fetch(url, {
        credentials: "include",
        ...fetchOptions,
      });

      // Handle 401 Unauthorized and 403 Forbidden - redirect to login
      if (
        (response.status === 401 || response.status === 403) &&
        !skipAuthRedirect
      ) {
        toast.error(getTranslation("error.api.session_expired"));

        // Get current language from URL or default to 'en'
        const currentPath = window.location.pathname;
        const langMatch = currentPath.match(/^\/([a-z]{2})\//);
        const lang = langMatch ? langMatch[1] : "en";

        window.location.href = `/${lang}/login`;
        throw new Error("Session expired");
      }

      return response as ApiResponse<T>;
    } catch (error) {
      if (error instanceof Error && error.message === "Session expired") {
        throw error;
      }

      // Handle network errors
      if (!skipAuthRedirect) {
        toast.error(getTranslation("error.api.network_error"));
      }
      throw error;
    }
  }

  async get<T = unknown>(
    url: string,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(
    url: string,
    options: ApiClientOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
