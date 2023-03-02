import { Flex, Spinner } from "@chakra-ui/react";
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
  const [loading, seLoading] = useState(false);

  useEffect(() => {
    seLoading(true);
    auth.onAuthStateChanged((user) => {
      setLoginUser(user);
      seLoading(false);
    })
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Flex justify="center" alignItems="center" h="100vh">
            <Spinner size='xl' color='black.500' />
          </Flex>
        </>
      ) : (
        <AuthContext.Provider value={{loginUser}}>
          {!loading && children}
        </AuthContext.Provider>
        )}
    </>
  )
}
