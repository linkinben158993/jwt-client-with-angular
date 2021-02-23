import { User } from '../../models/user';
import { AuthActions, AuthActionTypes } from '../actions/auth.actions';


export interface AppState {
  // Is a user authenticated?
  isAuthenticated: boolean;
  // If authenticated, there should be a user object
  user: User | null;
  // Error message
  errorMessage: string | null;
}

export const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null
};

export function reducer(state = initialState, action: AuthActions): AppState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: {
          uId: action.payload.uId,
          username: action.payload.username,
          token: action.payload.token,
        },
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect Email And/Or Password.'
      };
    }
    case AuthActionTypes.SIGNUP_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: {
          token: action.payload.token,
          username: action.payload.username
        },
        errorMessage: null
      };
    }
    case AuthActionTypes.SIGNUP_FAILURE: {
      return {
        ...state,
        errorMessage: 'That email is already in use.'
      };
    }
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}