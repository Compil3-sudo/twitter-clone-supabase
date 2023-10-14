"use client";

import { useContext } from "react";
import {
  InfiniteFeedContext,
  InfiniteFeedContextType,
  InfiniteScrollFeedOption,
} from "../context/InfiniteFeedContext";
import InfiniteScrollFeed from "./InfiniteScrollFeed";

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
      {activeFeed === InfiniteScrollFeedOption[0] ? (
        <InfiniteScrollFeed
          user={user}
          firstTweetsPage={firstTweetsPage}
          ComposeReply={ComposeReply}
          option={InfiniteScrollFeedOption[0]}
        />
      ) : (
        <>
          <InfiniteScrollFeed
            user={user}
            firstTweetsPage={firstFollowingTweetsPage}
            userFollowingIds={userFollowingIds}
            ComposeReply={ComposeReply}
            option={InfiniteScrollFeedOption[1]}
          />
        </>
      )}
    </>
  );
};

export default InfiniteFeed;
