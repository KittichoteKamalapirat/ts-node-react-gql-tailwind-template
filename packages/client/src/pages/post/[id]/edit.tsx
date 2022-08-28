import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { UseFormSetError } from "react-hook-form";
import PostEditor, {
  PostFormValues,
} from "../../../components/forms/PostEditor";
import { Layout } from "../../../components/layouts/Layout";

import PageHeading from "../../../components/typography/PageHeading";
import { Wrapper } from "../../../components/Wrapper";
import {
  Post,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { urlResolver } from "../../../lib/UrlResolver";
import { useGetPostId } from "../../../util/useGetPostId";
import { withApollo } from "../../../util/withApollo";

const EditPost = ({}) => {
  const router = useRouter(); //for pushing after we finished updating
  const postId = useGetPostId();
  const { data, loading } = usePostQuery({
    skip: postId === -1, //-1 won't by an id of any posts, just indication that we got bad url parameter
    variables: {
      id: postId,
    },
  });
  const [updatePost] = useUpdatePostMutation();

  const handleSubmitForm = async (
    data: PostFormValues,
    setError: UseFormSetError<PostFormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    try {
      const { errors } = await updatePost({
        variables: { id: postId, ...data },
      });

      if (!errors) {
        router.push(urlResolver.post(String(postId)));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <Layout heading="Loading">
        <div>loading ...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    //finish downloading, cannot finda post( like wrong id)
    return (
      <Layout heading="No post">
        <div>could not find a post</div>
      </Layout>
    );
  }
  return (
    <Layout heading="Edit post">
      <Wrapper variant="small">
        <PageHeading heading="Edit post" />
        <PostEditor
          onSubmitForm={handleSubmitForm}
          initialPostData={data.post as Post}
        />
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
