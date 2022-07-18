import { AlertModalState, AlertModalActionType } from "@/context/types";
import { AlertModalAction } from "@/context/actions";
import { AlertModalTypes } from "../types/alertModal";

const AlertModalReducer = (state: AlertModalState, action: AlertModalActionType) => {
  switch (action.type) {
    case AlertModalAction.PREPARE_UNSAVED_MODAL:
      return {
        ...state,
        canOpen: true,
        type: AlertModalTypes.UNSAVED,
      };

    case AlertModalAction.REQUIRE_CONFIRMATION_MODAL:
      return {
        ...state,
        isOpen: action.payload?.isOpen,
        toPerform: action.payload?.toPerform,
        type: AlertModalTypes.REQUIRE_CONFIRMATION,
      };

    case AlertModalAction.CUSTOM_CONFIRMATION_MODAL:
      return {
        ...state,
        isOpen: action.payload?.isOpen,
        toPerform: action.payload?.toPerform,
        type: AlertModalTypes.CUSTOM_CONFIRMATION,
        title: action.payload?.title,
        message: action.payload?.message,
      };

    case AlertModalAction.PREVENT_MODAL:
      return {
        ...state,
        canOpen: false,
        type: AlertModalTypes.NONE,
      };

    default:
      return state;
  }
};

export default AlertModalReducer;
