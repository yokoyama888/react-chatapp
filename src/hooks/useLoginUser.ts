import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";

export const useLoginUser = () => {
  return useContext(AuthContext);
}
