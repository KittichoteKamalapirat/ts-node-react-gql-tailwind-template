import { useRouter } from "next/dist/client/router";
import React, { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import Button, {
  ButtonTypes,
  HTMLButtonType,
} from "../components/Buttons/Button";
import TextField, { TextFieldTypes } from "../components/forms/TextField";
import useGeneralForm from "../components/hooks/useGeneralForm";
import { Layout } from "../components/layouts/Layout";

import PageHeading from "../components/typography/PageHeading";
import { Wrapper } from "../components/Wrapper";
import { InputType } from "../constants/inputType";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { urlResolver } from "../lib/UrlResolver";
import { toErrorMap } from "../util/toErrorMap";
import { withApollo } from "../util/withApollo";

enum FormNames {
  USERNAME_OR_EMAIL = "usernameOrEmail",
  PASSWORD = "password",
}

interface FormValues {
  [FormNames.USERNAME_OR_EMAIL]: string;
  [FormNames.PASSWORD]: string;
}

const initialData: FormValues = {
  usernameOrEmail: "",
  password: "",
};

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleSubmitForm = async (
    data: FormValues,
    setError: UseFormSetError<FormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    const response = await login({
      variables: data,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.login.user,
          },
        });
        cache.evict({ fieldName: "posts:{}" });
      },
    });
    // └ has to match what defined in graphqlmutation
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      // work we get the user!
      // If login, push to the previoius page
      if (typeof router.query.next === "string") {
        router.push(router.query.next);
      } else {
        router.push("/");
      }
    }
  };

  // setup form
  const { errors, submitForm, control } = useGeneralForm(
    initialData,
    handleSubmitForm
  );

  return (
    <Layout heading="Log in">
      <Wrapper variant="small">
        <PageHeading heading="Log in" />

        <form onSubmit={submitForm}>
          <TextField
            name={FormNames.USERNAME_OR_EMAIL}
            control={control as unknown as Control}
            label="Username or Email"
            type={TextFieldTypes.OUTLINED}
            extraClass="w-1/2"
            error={errors[FormNames.USERNAME_OR_EMAIL]}
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
          <div className="px-3.5 mt-2 flex justify-end">
            <Button
              type={ButtonTypes.TEXT}
              label="Forgot password?"
              buttonType={HTMLButtonType.BUTTON}
              href={urlResolver.forgotPassword()}
              spacing="px-3.5 mt-2"
            />
          </div>

          <Button
            type={ButtonTypes.PRIMARY}
            label="Log in"
            buttonType={HTMLButtonType.SUBMIT}
            spacing="px-3.5 mt-2"
          />
        </form>

        <p className="text-13px">
          Don&apos;t have an account?{" "}
          <Button
            href={urlResolver.register()}
            label="Sign up"
            type={ButtonTypes.TEXT}
          />
        </p>
      </Wrapper>
    </Layout>
  );
};

// we need to create the Urql client because we need to use Mutation
// somehow adding ssr true fix the localhost3000/grpahql problem, it's suppoed to be 4000
export default withApollo({ ssr: false })(Login);
