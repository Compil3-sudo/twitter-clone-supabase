import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import { getPagination } from "./InfiniteFeed";
import InfiniteScroll from "react-infinite-scroll-component";
import Tweet from "./Tweet";

const FollowingInfiniteFeed = ({
  userId,
  firstFollowingTweetsPage,
  userFollowingIds,
}: {
  userId: string;
  firstFollowingTweetsPage: TweetWithAuthor[];
  userFollowingIds: string[];
}) => {
  const [followingtweets, setFollowingTweets] = useState(
    firstFollowingTweetsPage
  );
  const [hasMoreFollowingTweets, setHasMoreFollowingTweets] = useState(true);
  const [pageFollowing, setPageFollowing] = useState(1);

  const limit = 10; // Number of tweets to load per page
  const supabase = createClientComponentClient<Database>();
  const { from, to } = getPagination(pageFollowing, limit);

  const lastFollowingTweet = firstFollowingTweetsPage[0];
  if (lastFollowingTweet.id !== followingtweets[0].id) {
    setFollowingTweets([lastFollowingTweet, ...followingtweets]);
  }

  useEffect(() => {
    const fetchFollowingTweets = async () => {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, author: profiles(*), likes(user_id)")
        .in("user_id", userFollowingIds)
        .order("created_at", { ascending: false })
        .limit(limit)
        .range(from, to);

      if (error) {
        console.error("Error fetching following tweets:", error);
      } else {
        const newFollowingTweets = data?.map((tweet) => ({
          ...tweet,
          author: tweet.author!,
          user_has_liked: !!tweet.likes.find((like) => like.user_id === userId),
          likes: tweet.likes.length,
        }));

        setFollowingTweets([...followingtweets, ...newFollowingTweets]);

        if (data.length < limit) {
          setHasMoreFollowingTweets(false); // No more tweets to load
        }
      }
    };

    fetchFollowingTweets();
  }, [pageFollowing]);

  const loadMoreFollowingTweets = () => {
    if (hasMoreFollowingTweets) {
      setPageFollowing(pageFollowing + 1);
    }
  };

  return (
    <>
      {/* FOLLOWING TWEETS INFINITE FEED */}
      <div className="flex flex-col items-center">
        <div className="w-full">
          {userFollowingIds.length === 0 ? (
            <h1 className="flex justify-center m-10">
              You are currently not following anyone. Follow some profiles :)
            </h1>
          ) : followingtweets.length > 0 ? (
            <InfiniteScroll
              dataLength={followingtweets.length}
              next={loadMoreFollowingTweets}
              hasMore={hasMoreFollowingTweets}
              loader={<h4>Loading...</h4>}
            >
              {followingtweets.map((tweet) => (
                <Tweet key={tweet.id} userId={userId} tweet={tweet} />
              ))}
            </InfiniteScroll>
          ) : (
            <h1 className="flex justify-center m-10">No Tweets Available :(</h1>
          )}
        </div>
      </div>
      {/* FOLLOWING TWEETS INFINITE FEED */}
    </>
  );
};

export default FollowingInfiniteFeed;
