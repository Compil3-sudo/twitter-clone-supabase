"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import { getPagination } from "./InfiniteFeed";
import InfiniteScroll from "react-infinite-scroll-component";
import Tweet from "./Tweet";
import { ImSpinner2 } from "react-icons/im";
import { InfiniteScrollFeedOption } from "../context/InfiniteFeedContext";

const InfiniteScrollFeed = ({
  user,
  firstTweetsPage,
  userFollowingIds,
  ComposeReply,
  userProfileId,
  option,
}: {
  user: Profile;
  firstTweetsPage: TweetWithAuthor[];
  userFollowingIds?: string[];
  ComposeReply: JSX.Element;
  userProfileId?: Profile["id"];
  option: (typeof InfiniteScrollFeedOption)[number];
}) => {
  const [tweets, setTweets] = useState(firstTweetsPage);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // get first page 0 from server
  const limit = 10; // Number of tweets to load per page
  const { from, to } = getPagination(page, limit);
  const supabase = createClientComponentClient<Database>();

  // the initial state is firstTweetsPage
  // this does not update when a new tweet is submitted for some reason
  // keep track of last tweet => reset initial state
  const lastTweet = firstTweetsPage[0];
  if (lastTweet?.id !== tweets[0]?.id) {
    setTweets([lastTweet, ...tweets]);
  }

  useEffect(() => {
    const fetchTweets = async () => {
      if (option === InfiniteScrollFeedOption[0]) {
        const { data, error } = await supabase
          .from("tweets")
          .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
          .order("created_at", { ascending: false })
          .limit(limit)
          .range(from, to);

        if (error) {
          console.error("Error fetching tweets:", error);
        } else {
          const newTweets = data?.map((tweet) => ({
            ...tweet,
            author: tweet.author!,
            user_has_liked: !!tweet.likes.find(
              (like) => like.user_id === user.id
            ),
            likes: tweet.likes.length,
            replies: tweet.replies.length,
          }));

          setTweets([...tweets, ...newTweets]);

          if (data.length < limit) {
            setHasMore(false); // No more tweets to load
          }
        }
      } else if (option === InfiniteScrollFeedOption[1]) {
        if (!userFollowingIds) return;

        const { data, error } = await supabase
          .from("tweets")
          .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
          .in("user_id", userFollowingIds) // for following tab
          .order("created_at", { ascending: false })
          .limit(limit)
          .range(from, to);

        if (error) {
          console.error("Error fetching tweets:", error);
        } else {
          const newTweets = data?.map((tweet: any) => ({
            ...tweet,
            author: tweet.author!,
            user_has_liked: !!tweet.likes.find(
              (like: any) => like.user_id === user.id
            ),
            likes: tweet.likes.length,
            replies: tweet.replies.length,
          }));

          setTweets([...tweets, ...newTweets]);

          if (data.length < limit) {
            setHasMore(false); // No more tweets to load
          }
        }
      } else if (option === InfiniteScrollFeedOption[2]) {
        if (!userProfileId) return;

        const { data, error } = await supabase
          .from("tweets")
          .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
          .eq("user_id", userProfileId) // for profile - own or different
          .order("created_at", { ascending: false })
          .limit(limit)
          .range(from, to);

        if (error) {
          console.error("Error fetching tweets:", error);
        } else {
          const newTweets = data?.map((tweet: any) => ({
            ...tweet,
            author: tweet.author!,
            user_has_liked: !!tweet.likes.find(
              (like: any) => like.user_id === user.id
            ),
            likes: tweet.likes.length,
            replies: tweet.replies.length,
          }));

          setTweets([...tweets, ...newTweets]);

          if (data.length < limit) {
            setHasMore(false); // No more tweets to load
          }
        }
      }
    };

    fetchTweets();
  }, [page]);

  const loadMoreTweets = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <>
      {/* TWEETS INFINITE FEED */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full">
          {userFollowingIds?.length === 0 ? (
            <h1 className="flex justify-center m-10">
              You are currently not following anyone. Follow some profiles :)
            </h1>
          ) : tweets.length > 0 ? (
            <InfiniteScroll
              dataLength={tweets.length}
              next={loadMoreTweets}
              hasMore={hasMore}
              className="no-scrollbar"
              loader={
                <ImSpinner2
                  size={50}
                  className="animate-spin text-blue-500 mx-auto mt-8"
                />
              }
            >
              {tweets.map((tweet) => (
                <Tweet
                  key={tweet.id}
                  userId={user.id}
                  tweet={tweet}
                  ComposeReply={ComposeReply}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <h1 className="flex justify-center m-10">No Tweets Available :(</h1>
          )}
        </div>
      </div>
      {/* TWEETS INFINITE FEED */}
    </>
  );
};

export default InfiniteScrollFeed;
