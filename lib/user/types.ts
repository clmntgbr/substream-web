export interface User {
  email?: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
  roles?: string[];
  id?: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type UserAction =
  | { type: "FETCH_ME_SUCCESS"; payload: User }
  | { type: "FETCH_ME_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_USER" };
