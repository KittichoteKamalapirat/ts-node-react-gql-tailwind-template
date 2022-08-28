import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import { Post, useCreatePostMutation } from "../../generated/graphql";
import { useIsAuth } from "../../util/useIsAuth";
import Button, { ButtonTypes, HTMLButtonType } from "../Buttons/Button";
import useGeneralForm from "../hooks/useGeneralForm";
import TextField, { TextFieldTypes } from "./TextField";

enum FormNames {
  TITLE = "title",
  TEXT = "text",
}

export interface PostFormValues {
  [FormNames.TITLE]: string;
  [FormNames.TEXT]: string;
}

interface Props {
  initialPostData: Post | null;
  onSubmitForm: (
    data: PostFormValues,
    setError: UseFormSetError<PostFormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => void;
}

export const formatInitialPostData = (
  initData: Post | null
): PostFormValues => {
  if (!initData)
    return {
      title: "",
      text: "",
    };
  const { title, text } = initData;

  return {
    title,
    text,
  };
};

const PostEditor = ({ initialPostData, onSubmitForm }: Props) => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  useIsAuth();

  // setup form
  const { errors, submitForm, control } = useGeneralForm(
    formatInitialPostData(initialPostData),
    onSubmitForm
  );

  return (
    <div>
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
          label={initialPostData ? "Update" : "Creates"}
          buttonType={HTMLButtonType.SUBMIT}
          spacing="px-3.5 mt-2"
        />
      </form>
    </div>
  );
};

export default PostEditor;
