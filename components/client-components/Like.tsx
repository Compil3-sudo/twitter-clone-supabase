"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Like = ({ user, tweet }: any) => {
  const supabase = createClientComponentClient();

  const toggleLikeTweet = async () => {
    if (tweet.user_has_liked) {
      const { data, error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("tweet_id", tweet.id);

      if (error) console.log(error);
    } else {
      const { error } = await supabase.from("likes").insert({
        user_id: user?.id,
        tweet_id: tweet.id,
      });

      if (error) console.log(error);
    }
  };

  const heartColor = tweet.user_has_liked ? "#ef4444" : "";

  return (
    <>
      <button
        onClick={toggleLikeTweet}
        style={{ color: heartColor }}
        className="group flex items-center hover:text-red-500 transition duration-200"
      >
        <div className="group-hover:bg-red-500/10 p-2 rounded-full">
          {tweet.user_has_liked ? (
            <AiFillHeart size={20} />
          ) : (
            <AiOutlineHeart size={20} />
          )}
        </div>
        <div className="text-sm px-1 justify-center">{tweet.likes}</div>
      </button>
    </>
  );
};

export default Like;
