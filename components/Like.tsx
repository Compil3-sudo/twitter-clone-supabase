"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

const Like = ({ user, tweet }: any) => {
  const supabase = createClientComponentClient();

  const toggleLikeTweet = async () => {
    if (tweet.author_has_liked) {
      const { data, error } = await supabase.from("likes").delete().match({
        tweet_id: tweet.id,
        user_id: user.id,
      });

      if (error) console.log(error);
    } else {
      const { error } = await supabase.from("likes").insert({
        user_id: user?.id,
        tweet_id: tweet.id,
      });

      if (error) console.log(error);
    }
  };

  return (
    <>
      <button onClick={toggleLikeTweet}>Like this Tweet</button>
    </>
  );
};

export default Like;
