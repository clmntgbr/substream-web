"use client";

import { useCallback, useEffect, useReducer } from "react";
import { fetchMe as fetchMeApi } from "./api";
import { UserContext } from "./context";
import { userReducer } from "./reducer";
import { UserState } from "./types";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const useFetchMe = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const user = await fetchMeApi();
      dispatch({ type: "FETCH_ME_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "FETCH_ME_ERROR", payload: "Failed to fetch user" });
    }
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  useEffect(() => {
    useFetchMe();
  }, [useFetchMe]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        useFetchMe,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
