"use client";

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
// import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ComposeTweetClient = ({ user, serverAction }: any) => {
  // const supabase = createClientComponentClient();

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
      setRemainingCharsColor("red-500");
    } else if (remainingChars >= 1 && remainingChars <= 20) {
      setRemainingCharsColor("yellow-500");
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

  const postTweet = async (data: FormData) => {
    if (
      tweetTextRef.current &&
      tweetTextRef.current.value !== "" &&
      tweetTextRef.current.value.length <= tweetMaxLength
    ) {
      // const { error } = await supabase.from("tweets").insert({
      //   user_id: user?.id,
      //   text: tweetTextRef.current!.value,
      // });

      // if (error) console.log(error);

      try {
        const response = await serverAction(data);

        console.log(response);

        tweetTextRef.current.value = "";
        if (response?.error) {
          console.log(response.error.message);
        }
      } catch (error) {
        console.log(error);
      }
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

        <form
          action={postTweet}
          className="flex flex-col w-full flex-grow px-2 pt-2"
        >
          <div className="flex flex-col w-full">
            <div className="flex flex-col border-b">
              <textarea
                ref={tweetTextRef}
                onChange={handleChange}
                maxLength={characterLimit}
                name="tweetText"
                // add invisible scrollbar
                className="bg-transparent border-none outline-none resize-none pt-2"
                placeholder="What is happening?!"
              />
            </div>

            <div className="flex flex-col items-end mt-4">
              <div className="flex">
                {remainingChars <= 20 && (
                  <p className={`py-2 px-4 text-${remainingCharsColor}`}>
                    {remainingChars}
                  </p>
                )}

                <button
                  type="submit"
                  className="rounded-full bg-blue-500 py-2 px-4"
                  // onClick={postTweet}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ComposeTweetClient;
