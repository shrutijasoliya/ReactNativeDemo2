import {createContext} from 'react';

export const AuthContext = createContext({
  authState: {signedIn: false},
  setAuthState: () => {},
});
