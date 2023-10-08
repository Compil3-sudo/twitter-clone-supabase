"use client";

import { useContext } from "react";
import {
  InfiniteFeedContext,
  InfiniteFeedContextType,
  InfiniteFeedTabs,
} from "./InfiniteFeedContext";
import ForYouInfiniteFeed from "./ForYouInfiniteFeed";
import FollowingInfiniteFeed from "./FollowingInfiniteFeed";

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const InfiniteFeed = ({
  userId,
  firstTweetsPage,
  firstFollowingTweetsPage,
  userFollowingIds,
}: {
  userId: string;
  firstTweetsPage: TweetWithAuthor[];
  firstFollowingTweetsPage: TweetWithAuthor[];
  userFollowingIds: string[];
}) => {
  const { activeFeed } = useContext(
    InfiniteFeedContext
  ) as InfiniteFeedContextType;

  return (
    <>
      {activeFeed === InfiniteFeedTabs[0] ? (
        <ForYouInfiniteFeed userId={userId} firstTweetsPage={firstTweetsPage} />
      ) : (
        <FollowingInfiniteFeed
          userId={userId}
          firstFollowingTweetsPage={firstFollowingTweetsPage}
          userFollowingIds={userFollowingIds}
        />
      )}
    </>
  );
};

export default InfiniteFeed;
