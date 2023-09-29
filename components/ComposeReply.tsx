"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useRef } from "react";

const ComposeReply = ({ user, tweet }: any) => {
  const supabase = createClientComponentClient();
  const replyTextRef = useRef<HTMLInputElement>(null);
  const replyMaxLength = 280;

  const sendReply = async () => {
    if (
      replyTextRef.current &&
      replyTextRef.current.value !== "" &&
      replyTextRef.current.value.length <= replyMaxLength
    ) {
      const { error } = await supabase.from("replies").insert({
        user_id: user?.id,
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
        style={{ color: "black" }}
        placeholder="Send Reply"
      />

      <button onClick={sendReply}>REPLY</button>
    </>
  );
};

export default ComposeReply;
