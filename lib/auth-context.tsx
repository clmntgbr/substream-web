"use client";

import { apiClient } from "@/lib/api-client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  id?: string;
  sub?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get("/api/profile", {
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
      // Don't fetch profile on public routes
      const isPublicRoute =
        pathname?.endsWith("/login") ||
        pathname?.endsWith("/register") ||
        pathname?.includes("/oauth");

      if (!isPublicRoute) {
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
        pathname.includes("/oauth");

      if (!user && !isPublicRoute) {
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
        const errorData = (await response.json()) as {
          error?: string;
          detail?: string;
          description?: string;
          errors?: Record<string, string[]>;
        };

        // If structured errors exist, pass them as JSON string
        if (errorData.errors && typeof errorData.errors === "object") {
          throw new Error(JSON.stringify(errorData));
        }

        // Otherwise use simple error message
        const errorMessage =
          errorData.error ||
          errorData.detail ||
          errorData.description ||
          "Failed to login";
        throw new Error(errorMessage);
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
