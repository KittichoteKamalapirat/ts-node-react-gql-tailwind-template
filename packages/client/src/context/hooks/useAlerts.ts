import { AlertContext } from "@/context/providers/alerts";
import { useContext } from "react";

const useAlerts = () => {
  const { state, dispatch } = useContext(AlertContext);

  const showSuccess = (message: string, autoHide = true, autoHideAfter = 4000) => {
    dispatch({
      type: "SHOW_SUCCESS",
      payload: {
        message,
        autoHide,
        autoHideAfter,
      },
    });
  };

  const showError = (message: string, autoHide = true, autoHideAfter = 5000) => {
    dispatch({
      type: "SHOW_ERROR",
      payload: {
        message,
        autoHide,
        autoHideAfter,
      },
    });
  };

  const showWarning = (message: string, autoHide = true, autoHideAfter = 4000) => {
    dispatch({
      type: "SHOW_WARNING",
      payload: {
        message,
        autoHide,
        autoHideAfter,
      },
    });
  };

  const showInfo = (message: string, autoHide = true, autoHideAfter = 4000) => {
    dispatch({
      type: "SHOW_INFO",
      payload: {
        message,
        autoHide,
        autoHideAfter,
      },
    });
  };

  const hide = () => {
    dispatch({
      type: "HIDE_ALERT",
    });
  };

  return {
    state,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
  };
};

export default useAlerts;
