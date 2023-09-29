"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef } from "react";

const ComposeTweet = ({ user }: any) => {
  const supabase = createClientComponentClient();
  const tweetTextRef = useRef<HTMLInputElement>(null);
  const tweetMaxLength = 280;

  const postTweet = async () => {
    if (
      tweetTextRef.current &&
      tweetTextRef.current.value !== "" &&
      tweetTextRef.current.value.length <= tweetMaxLength
    ) {
      const { error } = await supabase.from("tweets").insert({
        user_id: user?.id,
        text: tweetTextRef.current!.value,
      });

      if (error) console.log(error);
    }
  };

  return (
    <>
      <input
        ref={tweetTextRef}
        type="text"
        style={{ color: "black" }}
        placeholder="What's happening?"
      />

      <button onClick={postTweet}>post</button>
    </>
  );
};

export default ComposeTweet;
