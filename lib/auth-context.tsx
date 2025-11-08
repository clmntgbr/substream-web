"use client";

import { apiClient } from "@/lib/api-client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "./user/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface BackendError extends Error {
  key?: string;
  params?: Record<string, unknown>;
  errors?: Record<string, string[]>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get("/api/me", {
        skipAuthRedirect: true,
      });

      if (response.ok) {
        const data = (await response.json()) as { user: User };
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      setUser(null);
      return null;
    }
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const initAuth = async () => {
      // Don't fetch profile on public routes (except mixed routes)
      const isPublicRoute =
        pathname?.endsWith("/login") ||
        pathname?.endsWith("/register") ||
        pathname?.endsWith("/reset") ||
        pathname?.includes("/oauth");

      // Always fetch profile for mixed routes or private routes
      if (!isPublicRoute || pathname?.endsWith("/pricing")) {
        await fetchProfile();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute =
        pathname.endsWith("/login") ||
        pathname.endsWith("/register") ||
        pathname.endsWith("/reset") ||
        pathname.includes("/oauth");

      // Don't redirect from pricing (mixed route)
      if (!user && !isPublicRoute && !pathname.endsWith("/pricing")) {
        router.push(`/${lang}/login`);
      } else if (user && isPublicRoute) {
        router.push(`/${lang}`);
      }
    }
  }, [user, pathname, isLoading, router, lang]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post(
        "/api/token",
        { email, password },
        {
          headers: {
            "Content-Type": "application/ld+json",
          },
          skipAuthRedirect: true,
        },
      );

      if (response.ok) {
        const data = (await response.json()) as { user: User };
        setUser(data.user);
      } else {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
          description?: string;
          message?: string;
          key?: string;
          params?: Record<string, unknown>;
          errors?: Record<string, string[]>;
        };

        // If structured errors exist, pass them as JSON string
        if (errorData.errors && typeof errorData.errors === "object") {
          throw new Error(JSON.stringify(errorData));
        }

        // Otherwise use simple error message
        const errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          errorData.description ||
          "Failed to login";

        const error = new Error(errorMessage) as BackendError;
        if (typeof errorData.key === "string") {
          error.key = errorData.key;
        }
        if (errorData.params && typeof errorData.params === "object") {
          error.params = errorData.params as Record<string, unknown>;
        }

        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/logout", undefined, {
        skipAuthRedirect: true,
      });
    } catch {
    } finally {
      setUser(null);
      router.push(`/${lang}/login`);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
