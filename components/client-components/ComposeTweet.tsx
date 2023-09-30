"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef } from "react";

const ComposeTweet = ({ user }: any) => {
  const supabase = createClientComponentClient();
  const tweetTextRef = useRef<HTMLTextAreaElement>(null);
  const tweetMaxLength = 280;
  const characterLimit = 350;
  const maxTextAreaHeight = 300;

  const handleChange = () => {
    // if (
    //   tweetTextRef.current &&
    //   tweetTextRef.current.value.length >= tweetMaxLength
    // ) {
    //   tweetTextRef.current.style.color = "red";
    // } else {
    //   tweetTextRef.current!.style.color = "black";
    // }
    if (tweetTextRef.current) {
      tweetTextRef.current.style.height = "auto";
      tweetTextRef.current.style.height = `${Math.min(
        tweetTextRef.current.scrollHeight,
        maxTextAreaHeight
      )}px`;
    }
  };

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
      <div className="flex flex-row p-2 w-full space-x-4 border-b">
        <div className="rounded-full bg-white w-10 h-10 p-2">img</div>
        <div className="flex flex-col space-y-4 w-full px-2">
          <div className="flex flex-col border-b">
            <textarea
              ref={tweetTextRef}
              onChange={handleChange}
              maxLength={characterLimit}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                padding: "8px 0 0 0",
                // add invisible scrollbar
              }}
              placeholder="What is happening?!"
            />
          </div>

          <button
            className="self-end rounded-full bg-blue-500 py-2 px-4"
            style={{ marginBottom: "8px" }}
            onClick={postTweet}
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
};

export default ComposeTweet;
