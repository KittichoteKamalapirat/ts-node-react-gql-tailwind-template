import { AlertActionType, AlertState, AlertTypes } from "@/context/types/alerts";

const AlertReducer = (state: AlertState, action: AlertActionType) => {
  switch (action.type) {
    case "SHOW_SUCCESS":
      return {
        ...state,
        ...action.payload,
        type: AlertTypes.SUCCESS,
        dismissed: false,
      };

    case "SHOW_ERROR":
      return {
        ...state,
        ...action.payload,
        type: AlertTypes.ERROR,
        dismissed: false,
      };

    case "SHOW_WARNING":
      return {
        ...state,
        ...action.payload,
        type: AlertTypes.WARNING,
        dismissed: false,
      };

    case "SHOW_INFO":
      return {
        ...state,
        ...action.payload,
        type: AlertTypes.INFO,
        dismissed: false,
      };

    case "HIDE_ALERT":
      return {
        ...state,
        dismissed: true,
      };

    default:
      return state;
  }
};

export default AlertReducer;
