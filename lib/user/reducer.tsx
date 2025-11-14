import { UserState, UserAction } from './types';

export const userReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case 'FETCH_ME_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_ME_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
