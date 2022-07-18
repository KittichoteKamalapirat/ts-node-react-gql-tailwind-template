import { Box } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import Button, {
  ButtonTypes,
  HTMLButtonType,
} from "../components/Buttons/Button";
import TextField, { TextFieldTypes } from "../components/forms/TextField";
import useGeneralForm from "../components/hooks/useGeneralForm";
import PageHeading from "../components/typography/PageHeading";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { urlResolver } from "../lib/UrlResolver";
import { withApollo } from "../util/withApollo";

enum FormNames {
  EMAIL = "email",
}

interface FormValues {
  [FormNames.EMAIL]: string;
}

const initialData: FormValues = {
  email: "",
};

const ForgotPassword: React.FC<{}> = ({}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmitForm = async (
    data: FormValues,
    setError: UseFormSetError<FormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    await forgotPassword({ variables: data });
    setIsComplete(true);
  };

  // setup form
  const { errors, submitForm, control } = useGeneralForm(
    initialData,
    handleSubmitForm
  );

  return (
    <Wrapper variant="small">
      {isComplete ? (
        <Box>if an account with that email exists, we've sent you an email</Box>
      ) : (
        <>
          <PageHeading heading="Forgot password" />
          <form onSubmit={submitForm}>
            <TextField
              name={FormNames.EMAIL}
              control={control as unknown as Control}
              label="Email"
              type={TextFieldTypes.OUTLINED}
              extraClass="w-1/2"
              error={errors[FormNames.EMAIL]}
              required
            />

            <div className="px-3.5 mt-2 flex justify-end">
              <p className="text-13px">
                Back to
                <Button
                  href={urlResolver.login()}
                  label="Log in"
                  type={ButtonTypes.TEXT}
                />
              </p>
            </div>

            <Button
              type={ButtonTypes.PRIMARY}
              label="Change password"
              buttonType={HTMLButtonType.SUBMIT}
              spacing="px-3.5 mt-2"
            />
          </form>
        </>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
