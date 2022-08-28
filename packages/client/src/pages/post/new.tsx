import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { UseFormSetError } from "react-hook-form";
import PostEditor, { PostFormValues } from "../../components/forms/PostEditor";
import { Layout } from "../../components/layouts/Layout";

import PageHeading from "../../components/typography/PageHeading";
import { Wrapper } from "../../components/Wrapper";
import { useCreatePostMutation } from "../../generated/graphql";
import { useIsAuth } from "../../util/useIsAuth";
import { withApollo } from "../../util/withApollo";

const CreatePost = () => {
  useIsAuth();

  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  const handleSubmitForm = async (
    data: PostFormValues,
    setError: UseFormSetError<PostFormValues>,
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

  return (
    <Layout heading="Create post">
      <Wrapper variant="small">
        <PageHeading heading="Create post" />
        <PostEditor onSubmitForm={handleSubmitForm} initialPostData={null} />
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
