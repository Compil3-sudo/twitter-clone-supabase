"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
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
      if (tweetTextRef.current) {
        tweetTextRef.current.removeEventListener("input", countCharacters);
      }
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
      <div className="flex py-4 px-4 space-x-2 border-b">
        <div className="flex-none">
          <Image
            src={user.user_metadata.avatar_url}
            width={40}
            height={40}
            className="rounded-full"
            alt="Profile Image"
          />
        </div>

        <div
          className="flex flex-col w-full flex-grow"
          style={{ padding: "8px 8px 0px 8px" }}
        >
          <div className="flex flex-col w-full">
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

            <div className="flex flex-col items-end mt-4">
              <div className="flex">
                {remainingChars <= 20 && (
                  <p
                    className="py-2 px-4"
                    style={{ color: `${remainingCharsColor}` }}
                  >
                    {remainingChars}
                  </p>
                )}

                <button
                  className="rounded-full bg-blue-500 py-2 px-4"
                  onClick={postTweet}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeTweet;
