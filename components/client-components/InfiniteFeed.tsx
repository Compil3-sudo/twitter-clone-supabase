"use client";

import { useContext } from "react";
import {
  InfiniteFeedContext,
  InfiniteFeedContextType,
  InfiniteFeedTabs,
} from "../context/InfiniteFeedContext";
import ForYouInfiniteFeed from "./ForYouInfiniteFeed";
import FollowingInfiniteFeed from "./FollowingInfiniteFeed";

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const InfiniteFeed = ({
  user,
  firstTweetsPage,
  firstFollowingTweetsPage,
  userFollowingIds,
  ComposeReply,
}: {
  user: Profile;
  firstTweetsPage: TweetWithAuthor[];
  firstFollowingTweetsPage: TweetWithAuthor[];
  userFollowingIds: string[];
  ComposeReply: JSX.Element;
}) => {
  const { activeFeed } = useContext(
    InfiniteFeedContext
  ) as InfiniteFeedContextType;

  return (
    <>
      {activeFeed === InfiniteFeedTabs[0] ? (
        <ForYouInfiniteFeed
          user={user}
          firstTweetsPage={firstTweetsPage}
          ComposeReply={ComposeReply}
        />
      ) : (
        <FollowingInfiniteFeed
          userId={user.id}
          firstFollowingTweetsPage={firstFollowingTweetsPage}
          userFollowingIds={userFollowingIds}
          ComposeReply={ComposeReply}
        />
      )}
    </>
  );
};

export default InfiniteFeed;
