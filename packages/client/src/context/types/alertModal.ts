export enum AlertModalTypes {
  UNSAVED = "unsaved",
  REQUIRE_CONFIRMATION = "requireConfirmation",
  CUSTOM_CONFIRMATION = "customConfirmation",
  NONE = "none",
}

export interface AlertModalState {
  canOpen?: boolean;
  isOpen?: boolean;
  toPerform?: () => void;
  type?: AlertModalTypes;
  title?: string;
  message?: string;
}

export interface AlertModalActionType {
  type: string;
  payload?: AlertModalState;
}

export interface ModalDisplayInformation {
  title: string;
  message: string;
}
