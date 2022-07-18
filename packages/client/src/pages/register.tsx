import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import Button, {
  ButtonTypes,
  HTMLButtonType,
} from "../components/Buttons/Button";
import TextField, { TextFieldTypes } from "../components/forms/TextField";
import useGeneralForm from "../components/hooks/useGeneralForm";
import PageHeading from "../components/typography/PageHeading";
import { Wrapper } from "../components/Wrapper";
import { InputType } from "../constants/inputType";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { urlResolver } from "../lib/UrlResolver";
import { toErrorMap } from "../util/toErrorMap";
import { withApollo } from "../util/withApollo";

enum FormNames {
  USERNAME = "username",
  EMAIL = "email",
  PASSWORD = "password",
}

interface FormValues {
  [FormNames.USERNAME]: string;
  [FormNames.EMAIL]: string;
  [FormNames.PASSWORD]: string;
}

const initialData: FormValues = {
  username: "",
  email: "",
  password: "",
};

export const Register = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const handleSubmitForm = async (
    data: FormValues,
    setError: UseFormSetError<FormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    try {
      const response = await register({
        variables: { data },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.register.user,
            },
          });
        },
      });

      if (response.data?.register.errors) {
        // instead of setErrors({username: "error message"}) we do
        setErrors(toErrorMap(response.data.register.errors));
      } else if (response.data?.register.user) {
        router.push("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // setup form
  const { errors, submitForm, control } = useGeneralForm(
    initialData,
    handleSubmitForm
  );

  return (
    <Wrapper variant="small">
      <PageHeading heading="Sign up" />
      <form onSubmit={submitForm}>
        <TextField
          name={FormNames.USERNAME}
          control={control as unknown as Control}
          label="Username"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.USERNAME]}
          required
        />

        <TextField
          name={FormNames.EMAIL}
          control={control as unknown as Control}
          label="Email"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.EMAIL]}
          required
        />

        <TextField
          name={FormNames.PASSWORD}
          control={control as unknown as Control}
          label="Password"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.PASSWORD]}
          inputType={InputType.Password}
          required
        />

        <Button
          type={ButtonTypes.PRIMARY}
          label="Sign up"
          buttonType={HTMLButtonType.SUBMIT}
          spacing="px-3.5 mt-2"
        />
      </form>

      <p className="text-13px">
        Already have an account?
        <Button
          href={urlResolver.login()}
          label="Log in"
          type={ButtonTypes.TEXT}
        />
      </p>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
