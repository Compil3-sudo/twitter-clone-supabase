"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { getPagination } from "./InfiniteFeed";
import InfiniteScroll from "react-infinite-scroll-component";
import Tweet from "./Tweet";

const ForYouInfiniteFeed = ({
  userId,
  firstTweetsPage,
}: {
  userId: string;
  firstTweetsPage: TweetWithAuthor[];
}) => {
  const [tweets, setTweets] = useState(firstTweetsPage);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10; // Number of tweets to load per page
  const supabase = createClientComponentClient<Database>();
  const { from, to } = getPagination(page, limit);

  // the initial state is firstTweetsPage
  // this does not update when a new tweet is submitted for some reason
  // keep track of last tweet => reset initial state
  const lastTweet = firstTweetsPage[0];
  if (lastTweet.id !== tweets[0].id) {
    setTweets([lastTweet, ...tweets]);
  }

  useEffect(() => {
    const fetchTweets = async () => {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, author: profiles(*), likes(user_id)")
        .order("created_at", { ascending: false })
        .limit(limit)
        .range(from, to);

      if (error) {
        console.error("Error fetching tweets:", error);
      } else {
        const newTweets = data?.map((tweet) => ({
          ...tweet,
          author: tweet.author!,
          user_has_liked: !!tweet.likes.find((like) => like.user_id === userId),
          likes: tweet.likes.length,
        }));

        setTweets([...tweets, ...newTweets]);

        if (data.length < limit) {
          setHasMore(false); // No more tweets to load
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
      <div className="flex flex-col items-center">
        <div className="w-full">
          {tweets.length > 0 ? (
            <InfiniteScroll
              dataLength={tweets.length}
              next={loadMoreTweets}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              {tweets.map((tweet) => (
                <Tweet key={tweet.id} userId={userId} tweet={tweet} />
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

export default ForYouInfiniteFeed;
