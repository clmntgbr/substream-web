'use client';

import { useReducer, useCallback } from 'react';
import { UserContext } from './context';
import { userReducer } from './reducer';
import { fetchMe as fetchMeApi } from './api';
import { UserState } from './types';

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const fetchMe = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await fetchMeApi();
      dispatch({ type: 'FETCH_ME_SUCCESS', payload: user });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user';
      dispatch({ type: 'FETCH_ME_ERROR', payload: message });
    }
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...state,
        fetchMe,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
