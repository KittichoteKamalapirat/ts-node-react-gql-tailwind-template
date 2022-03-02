import { ApolloCache } from "@apollo/client";
import React from "react";
import {
  ToggleFollowMutation,
  User,
  useToggleFollowMutation,
} from "../generated/graphql";
import { gql } from "@apollo/client";
import { Button } from "@chakra-ui/button";
import { inActiveGray } from "./Variables";
import { Box } from "@chakra-ui/layout";

interface FollowSectionProps {
  targetUserId: string;
  user: User;
}

const updateAfterToggle = (
  //   value: number,
  cache: ApolloCache<ToggleFollowMutation>,
  targetUserId: string
) => {
  const user = cache.readFragment<{
    id: string;
    isFollowed: boolean;
    followerNum: number;
  }>({
    id: "User:" + targetUserId,
    fragment: gql`
      fragment _ on User {
        id
        isFollowed
        followerNum
      }
    `,
  });

  if (user) {
    const newfollowerNum =
      (user.followerNum as number) + (user.isFollowed ? -1 : +1);

    cache.writeFragment({
      id: "User:" + targetUserId,
      fragment: gql`
        fragment __ on User {
          id
          followerNum
          isFollowed
        }
      `,
      data: {
        id: targetUserId,
        isFollowed: !user?.isFollowed,
        followerNum: newfollowerNum,
      },
    });
  }
};

export const FollowSection: React.FC<FollowSectionProps> = ({
  targetUserId,
  user,
}) => {
  const [toggleFollow] = useToggleFollowMutation();

  return (
    <Box my={4}>
      <Button
        colorScheme={!user.isFollowed ? "brand" : inActiveGray}
        minWidth="110px"
        variant={!user.isFollowed ? "solid" : "outline"}
        onClick={async () => {
          await toggleFollow({
            variables: { targetUserId: targetUserId },
            update: (cache) => updateAfterToggle(cache, targetUserId),
          });
        }}
      >
        {!user.isFollowed ? "Follow" : "Following"}
      </Button>
    </Box>
  );
};