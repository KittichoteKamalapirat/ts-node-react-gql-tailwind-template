import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import Button, {
  ButtonTypes,
  HTMLButtonType,
} from "../components/Buttons/Button";
import TextField, { TextFieldTypes } from "../components/forms/TextField";
import useGeneralForm from "../components/hooks/useGeneralForm";
import { Layout } from "../components/Layout";
import PageHeading from "../components/typography/PageHeading";
import { Wrapper } from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../util/useIsAuth";
import { withApollo } from "../util/withApollo";

enum FormNames {
  TITLE = "title",
  TEXT = "text",
}

interface FormValues {
  [FormNames.TITLE]: string;
  [FormNames.TEXT]: string;
}

const initialData = {
  title: "",
  text: "",
};

const CreatePost = () => {
  //router import for below, not for useIsAuth
  useIsAuth();

  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  const handleSubmitForm = async (
    data: FormValues,
    setError: UseFormSetError<FormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    try {
      const { errors } = await createPost({
        variables: {
          input: {
            title: data.title,
            text: data.text,
          },
        },
        update: (cache) => {
          cache.evict({ fieldName: "posts:{}" });
        },
      });
      if (!errors) {
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
    <Layout variant="small">
      <Wrapper variant="small">
        <PageHeading heading="Create post" />

        <form onSubmit={submitForm}>
          <TextField
            name={FormNames.TITLE}
            control={control as unknown as Control}
            label="Title"
            type={TextFieldTypes.OUTLINED}
            extraClass="w-1/2"
            error={errors[FormNames.TITLE]}
            required
          />

          <TextField
            name={FormNames.TEXT}
            control={control as unknown as Control}
            label="Body"
            type={TextFieldTypes.OUTLINED}
            extraClass="w-1/2"
            error={errors[FormNames.TEXT]}
            required
          />

          <Button
            type={ButtonTypes.PRIMARY}
            label="Create Post"
            buttonType={HTMLButtonType.SUBMIT}
            spacing="px-3.5 mt-2"
          />
        </form>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
