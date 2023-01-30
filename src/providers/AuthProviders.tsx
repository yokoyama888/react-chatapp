import { User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../config/firebase";

export type AuthUserContextType = {
  loginUser: User | null;
};

export const AuthContext = createContext<AuthUserContextType>({} as AuthUserContextType);

export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [loginUser, setLoginUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoginUser(user);
    })
  }, []);

  return (
    <AuthContext.Provider value={{loginUser}}>
      {children}
    </AuthContext.Provider>
  )
}
