export enum AlertTypes {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface AlertState {
  message: string;
  autoHide: boolean;
  autoHideAfter: number;
  dismissed?: boolean;
  type?: AlertTypes;
}

export type AlertActionType =
  | {
      type: "HIDE_ALERT";
    }
  | {
      type: "SHOW_SUCCESS" | "SHOW_ERROR" | "SHOW_WARNING" | "SHOW_INFO";
      payload: {
        message: string;
        autoHide: boolean;
        autoHideAfter: number;
      };
    };
