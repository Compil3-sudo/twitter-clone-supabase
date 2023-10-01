"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";

const ComposeTweet = ({ user }: any) => {
  const supabase = createClientComponentClient();
  const tweetTextRef = useRef<HTMLTextAreaElement>(null);
  const tweetMaxLength = 280;
  const characterLimit = 350;
  const maxTextAreaHeight = 300;
  const [remainingChars, setRemainingChars] = useState(tweetMaxLength);
  const [remainingCharsColor, setRemainingCharsColor] = useState("yellow");

  const countCharacters = () => {
    setRemainingChars(tweetMaxLength - tweetTextRef.current!.value.length);
  };

  useEffect(() => {
    tweetTextRef.current!.addEventListener("input", countCharacters);

    if (remainingChars <= 0) {
      setRemainingCharsColor("red");
    } else if (remainingChars >= 1 && remainingChars <= 20) {
      setRemainingCharsColor("yellow");
    }

    return () => {
      tweetTextRef.current!.removeEventListener("input", countCharacters);
    };
  }, [tweetTextRef.current?.value.length]);

  const handleChange = () => {
    // making the entire text red looks ugly
    // don't know how to only make the part > tweetMaxLength red

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

          <div className="flex flex-row self-end justify-center">
            {remainingChars <= 20 && (
              <p
                className="py-2 px-4"
                style={{ color: `${remainingCharsColor}` }}
              >
                {remainingChars}
              </p>
            )}

            <button
              className="self-end rounded-full bg-blue-500 py-2 px-4"
              style={{ marginBottom: "8px" }}
              onClick={postTweet}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeTweet;
