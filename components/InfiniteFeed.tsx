"use client";

import Tweet from "@/components/client-components/Tweet";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const InfiniteFeed = ({ user, firstTweetsPage }: any) => {
  const [tweets, setTweets] = useState<any[]>(firstTweetsPage);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10; // Number of tweets to load per page
  const supabase = createClientComponentClient();
  const { from, to } = getPagination(page, limit);

  // the initial state is firstTweetsPage
  // this does not update when a new tweet is submitted for some reason
  // keep track of last tweet => reset initial state
  const lastTweet = firstTweetsPage[0];
  if (lastTweet != tweets[0]) {
    setTweets(firstTweetsPage);
  }

  useEffect(() => {
    const fetchTweets = async () => {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, author: profiles(*), likes(*)")
        .order("created_at", { ascending: false })
        .limit(limit)
        .range(from, to);

      if (error) {
        console.error("Error fetching tweets:", error);
      } else {
        const newTweets = data?.map((tweet: any) => ({
          ...tweet,
          user_has_liked: !!tweet.likes.find(
            (like: any) => like.user_id === user?.id
          ),
          likes: tweet.likes.length,
        }));

        setTweets([...tweets, ...newTweets]);

        if (data.length < limit) {
          setHasMore(false); // No more tweets to load
        }
      }
    };
    console.log("first");

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
          <InfiniteScroll
            dataLength={tweets.length}
            next={loadMoreTweets}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            {tweets.map((tweet: any) => (
              <Tweet key={tweet.id} user={user} tweet={tweet} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      {/* TWEETS INFINITE FEED */}
    </>
  );
};

export default InfiniteFeed;
