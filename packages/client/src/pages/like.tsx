import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { Layout } from "../components/layouts/Layout";
import { useMeQuery, useVotedPostsQuery } from "../generated/graphql";
import { withApollo } from "../util/withApollo";

interface likeProps {}

const Like: React.FC = ({}) => {
  const { data, error, loading, fetchMore, variables } = useVotedPostsQuery({
    variables: { limit: 10, cursor: null as null | string },
  });
  const { data: meData, loading: meLoading } = useMeQuery();

  let body = null;
  if (loading) {
    body = <Text>Loading</Text>;
  } else if (!meData?.me) {
    body = <Text>You don't have a favorite recipe</Text>;
  } else {
    body = (
      <Box>
        {data?.votedPosts.posts.map((post) => (
          <NextLink
            href={{
              pathname: "/post/[id]",
              query: { id: post.id },
            }}
          >
            <Link>
              <Flex m={2}>
                <Box flex={2} m={2}>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text>{post.textSnippet}...</Text>
                </Box>
              </Flex>
            </Link>
          </NextLink>
        ))}
      </Box>
    );
  }
  return (
    <Layout>
      <Text ml="1rem" fontSize="xl">
        เมนูโปรดของฉัน
      </Text>
      <Box>{body}</Box>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Like);
