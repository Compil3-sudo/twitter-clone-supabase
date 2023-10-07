"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Like = ({ user, tweet }: any) => {
  const supabase = createClientComponentClient<Database>();
  const [userHasLiked, setUserHasLiked] = useState(tweet.user_has_liked);
  const [likesCount, setLikesCount] = useState(tweet.likes);

  const toggleLikeTweet = async () => {
    if (userHasLiked) {
      const { data, error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("tweet_id", tweet.id);

      if (error) {
        console.log(error);
      } else {
        setUserHasLiked(false);
        setLikesCount((prevCount: any) => prevCount - 1);
      }
    } else {
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        tweet_id: tweet.id,
      });

      if (error) {
        console.log(error);
      } else {
        setUserHasLiked(true);
        setLikesCount((prevCount: any) => prevCount + 1);
      }
    }
  };

  const heartColor = userHasLiked ? "text-red-500" : "";

  return (
    <>
      <button
        onClick={toggleLikeTweet}
        className={`group flex items-center ${heartColor} hover:text-red-500 transition duration-200`}
      >
        <div className="group-hover:bg-red-500/10 p-2 rounded-full">
          {userHasLiked ? (
            <AiFillHeart size={20} />
          ) : (
            <AiOutlineHeart size={20} />
          )}
        </div>
        <div className="text-sm px-1 justify-center">{likesCount}</div>
      </button>
    </>
  );
};

export default Like;
