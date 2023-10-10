"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useRef } from "react";
import CustomTextArea from "./CustomTextArea";

const ComposeReply = ({
  userId,
  tweet,
}: {
  userId: string;
  tweet: TweetWithAuthor;
}) => {
  const supabase = createClientComponentClient<Database>();
  const replyTextRef = useRef<HTMLTextAreaElement>(null);
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
        text: replyTextRef.current.value,
      });

      if (error) console.log(error);
    }
  };

  return (
    <>
      <CustomTextArea
        formAction={sendReply}
        txtAreaTextRef={replyTextRef}
        buttonText="Reply"
        txtAreaPlaceholder="Post your reply"
        txtAreaName="replyText"
      />
    </>
  );
};

export default ComposeReply;
