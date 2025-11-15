"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer } from "react";
import { loginApi, logoutApi, registerApi } from "./api";
import { AuthContext } from "./context";
import { authReducer } from "./reducer";
import { AuthState, LoginPayload, RegisterPayload } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await loginApi(payload);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: data,
        });

        router.push("/studio");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "LOGIN_ERROR", payload: message });
      }
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await registerApi(payload);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "REGISTER_SUCCESS",
          payload: data,
        });

        router.push("/studio");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        dispatch({ type: "REGISTER_ERROR", payload: message });
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await logoutApi();
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!state.token && !state.loading) {
      router.push("/login");
    }
  }, [state.token, state.loading, router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
