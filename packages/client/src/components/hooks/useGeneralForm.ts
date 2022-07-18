import { Dispatch, SetStateAction, useState } from "react";
import {
  DeepPartial,
  SubmitHandler,
  useForm,
  UseFormSetError,
} from "react-hook-form";
import useDirtyFormModal from "./useDirtyFormModal";
// not sure why "hooks" on its own didn't resolve

// Utility hook that wraps `useForm` with common requirements:
// - unsaved changes modal
// - custom submit handler
// - initialValues setup
// - generic error messages and resetting on submit
//
// It exposes two Generic types, one for the form's initial values and one for the forms's final
// valid values.
// This is because inputs can be initialised with values that are invalid, such as a blank
// dropdown. This helps ensuring that we separate what gets sent out with what
// gets presented to the user.

export type FormSubmitParams<Initial, Valid> = [
  submittingData: Valid,
  setError: UseFormSetError<Initial>,
  setGenericErrorMessage: Dispatch<SetStateAction<string>>,
  preventModal: () => void
];

export type FormValidateParams<Initial, Valid> = [
  submittingData: Valid,
  setError: UseFormSetError<Initial>,
  setGenericErrorMessage: Dispatch<SetStateAction<string>>
];

function useGeneralForm<
  InitialValues extends Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ValidValues extends Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  initialData: Partial<InitialValues>,
  formHandler: (...args: FormSubmitParams<InitialValues, ValidValues>) => void,
  isGenerallyValid?: (
    ...args: FormValidateParams<InitialValues, ValidValues>
  ) => boolean
) {
  const {
    handleSubmit,
    setError,
    formState: { errors, isDirty },
    ...rest
  } = useForm<InitialValues>({
    defaultValues: initialData as DeepPartial<InitialValues>, // bit hacky https://github.com/react-hook-form/react-hook-form/discussions/3713
  });

  const [genericErrorMessage, setGenericErrorMessage] = useState("");

  const [preventModal, forceModal] = useDirtyFormModal(isDirty);

  const onSubmit: SubmitHandler<InitialValues> = async (data) => {
    // Casting the `data` parameter causes errors with TS when compiling
    // Reset current generic errors
    setGenericErrorMessage("");

    // If there's no general validation or if it passes then we good to try submit
    if (
      !isGenerallyValid ||
      isGenerallyValid(data as ValidValues, setError, setGenericErrorMessage)
    ) {
      formHandler(
        data as ValidValues,
        setError,
        setGenericErrorMessage,
        preventModal
      );
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return {
    errors, // instead of destructuring formState
    isDirty, // useful for conditionally rendering UI components
    submitForm,
    setError,
    genericErrorMessage,
    preventModal,
    forceModal,
    ...rest, // now anything else returned by useForm also is returned by this hook. Yay.
  };
}

export default useGeneralForm;
