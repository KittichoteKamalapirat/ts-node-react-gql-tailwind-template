import { AlertModalAction } from "@/context/actions";
import { AlertModalContext } from "@/context/providers";
import { useContext } from "react";
import { ModalDisplayInformation } from "../types";

const useAlertModal = () => {
  const { state, dispatch } = useContext(AlertModalContext);

  const prevent = () => {
    dispatch({
      type: AlertModalAction.PREVENT_MODAL,
    });
  };

  const prepareUnsavedModal = () => {
    dispatch({
      type: AlertModalAction.PREPARE_UNSAVED_MODAL,
    });
  };

  const requireConfirmationModal = (toPerform: () => void) => {
    dispatch({
      type: AlertModalAction.REQUIRE_CONFIRMATION_MODAL,
      payload: { isOpen: !state.isOpen, toPerform },
    });
  };

  const customConfirmationModal = (modalInfo: ModalDisplayInformation, toPerform: () => void) => {
    dispatch({
      type: AlertModalAction.CUSTOM_CONFIRMATION_MODAL,
      payload: { isOpen: !state.isOpen, toPerform, ...modalInfo },
    });
  };

  return {
    state,
    prevent,
    prepareUnsavedModal,
    requireConfirmationModal,
    customConfirmationModal,
  };
};

export default useAlertModal;
