"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useRef } from "react";

const ComposeReply = ({
  userId,
  tweet,
}: {
  userId: string;
  tweet: TweetWithAuthor;
}) => {
  const supabase = createClientComponentClient<Database>();
  const replyTextRef = useRef<HTMLInputElement>(null);
  const replyMaxLength = 280;

  const sendReply = async () => {
    if (
      replyTextRef.current &&
      replyTextRef.current.value !== "" &&
      replyTextRef.current.value.length <= replyMaxLength
    ) {
      const { error } = await supabase.from("replies").insert({
        user_id: userId,
        tweet_id: tweet.id,
        text: replyTextRef.current!.value,
      });

      if (error) console.log(error);
    }
  };

  return (
    <>
      <input
        ref={replyTextRef}
        type="text"
        className="text-black"
        placeholder="Post your reply"
      />

      <button onClick={sendReply}>REPLY</button>
    </>
  );
};

export default ComposeReply;
