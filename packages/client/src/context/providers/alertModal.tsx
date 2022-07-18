import { AlertModalActionType, AlertModalState } from "@/context/types";
import { AlertModalReducer } from "@/context/reducers";
import { createContext, Dispatch, useReducer } from "react";
import { AlertModalTypes } from "../types/alertModal";

export const initialAlertModalState: AlertModalState = {
  canOpen: false,
  type: AlertModalTypes.NONE,
};

export interface AlertModalContextType {
  state: AlertModalState;
  dispatch: Dispatch<AlertModalActionType>;
}

export const AlertModalContext = createContext<AlertModalContextType>({
  state: initialAlertModalState,
  dispatch: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

const AlertModalProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(AlertModalReducer, initialAlertModalState);

  const value = {
    state,
    dispatch,
  };

  return <AlertModalContext.Provider value={value}>{children}</AlertModalContext.Provider>;
};

export default AlertModalProvider;
