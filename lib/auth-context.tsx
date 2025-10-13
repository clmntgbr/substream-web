"use client";

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
      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include", // Important for cookies
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
      await fetchProfile();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = pathname.endsWith("/login") || pathname.endsWith("/register");

      if (!user && !isPublicRoute) {
        router.push(`/${lang}/login`);
      } else if (user && isPublicRoute) {
        router.push(`/${lang}`);
      }
    }
  }, [user, pathname, isLoading, router, lang]);

  const login = async (email: string, password: string) => {
    try {
      // Send credentials to API to authenticate and set session cookie
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = (await response.json()) as { user: User };
        setUser(data.user);
      } else {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || "Failed to login");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });
    } catch {
    } finally {
      setUser(null);
      router.push(`/${lang}/login`);
    }
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
