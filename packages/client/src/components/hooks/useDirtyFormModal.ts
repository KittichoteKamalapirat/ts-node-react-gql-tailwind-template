import { useAlertModal } from "@/context/hooks";
import { useEffect } from "react";

export default function useDirtyFormModal(isDirty: boolean): Array<() => void> {
  const alertModal = useAlertModal();
  useEffect(() => {
    if (isDirty) alertModal.prepareUnsavedModal();
    else alertModal.prevent();
  }, [isDirty]);
  const preventModal = alertModal.prevent;
  const forceModal = alertModal.prepareUnsavedModal;

  return [preventModal, forceModal];
}
