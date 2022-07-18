import { createContext, Dispatch, useReducer } from "react";
import { AlertActionType, AlertState, AlertTypes } from "@/context/types/alerts";
import AlertReducer from "@/context/reducers/alerts";

export const initialAlertState: AlertState = {
  message: "",
  type: AlertTypes.SUCCESS,
  autoHide: true,
  autoHideAfter: 4000,
  dismissed: true,
};

export interface AlertContextType {
  state: AlertState;
  dispatch: Dispatch<AlertActionType>;
}

export const AlertContext = createContext<AlertContextType>({
  state: initialAlertState,
  dispatch: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

const AlertProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(AlertReducer, initialAlertState);

  const value = {
    state,
    dispatch,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertProvider;
