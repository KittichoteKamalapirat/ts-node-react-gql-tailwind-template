import { EditDeletePostButtons } from "../../../components/EditDeletePostButtons";
import { Layout } from "../../../components/layouts/Layout";
import { Error } from "../../../components/skeletons/Error";
import PageHeading from "../../../components/typography/PageHeading";
import { useMeQuery } from "../../../generated/graphql";
import { useGetPostFromUrl } from "../../../util/useGetPostFromUrl";
import { withApollo } from "../../../util/withApollo";

const Post = ({}) => {
  const { data, loading, error } = useGetPostFromUrl();
  const { data: meData } = useMeQuery();

  if (loading) {
    return (
      <Layout heading="Loading">
        <div>loading ...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout heading="Error">
        <Error text={error.message} />
      </Layout>
    );
  }

  return (
    <Layout heading="Post">
      <PageHeading heading={data?.post?.title} />
      <div className="mb-4">{data?.post?.text}</div>

      {meData?.me?.id !== data?.post?.creator.id ? null : (
        <EditDeletePostButtons id={data?.post?.id as number} />
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post); //want good SEO
