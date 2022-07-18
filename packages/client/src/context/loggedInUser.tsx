import { createContext, useContext, useState } from "react";
import UserCookieResolver from "@/lib/UserCookieResolver";
import LoggedInUser from "@/lib/loggedInUser";

export interface LoggedInUserDataType {
  role: string | undefined;
  userId: string | undefined;
}

interface LoggedInUserType {
  role: LoggedInUserDataType["role"];
  userId: LoggedInUserDataType["userId"];
  setLoggedInUserState: (arg1: LoggedInUserDataType) => void;
}

const LoggedInUserContext = createContext<LoggedInUserType>({
  role: undefined,
  userId: undefined,
  setLoggedInUserState: () => void {},
});

export const useLoggedInUser = () => {
  const { role, userId } = useContext(LoggedInUserContext);
  return new LoggedInUser(role, userId);
};

export const useSetLoggedInUser = () => {
  const { setLoggedInUserState } = useContext(LoggedInUserContext);
  return setLoggedInUserState;
};
interface Props {
  children: React.ReactNode;
}

export const LoggedInUserProvider = ({ children }: Props) => {
  const userCookieResolver = new UserCookieResolver();
  const [loggedInUserState, setLoggedInUserState] = useState<{
    role: LoggedInUserDataType["role"];
    userId: LoggedInUserDataType["userId"];
  }>(userCookieResolver.getLoggedInUser());

  const contextValue = {
    ...loggedInUserState,
    setLoggedInUserState,
  };

  return (
    <LoggedInUserContext.Provider value={contextValue}>{children}</LoggedInUserContext.Provider>
  );
};
