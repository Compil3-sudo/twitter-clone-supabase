"use client";

import { PostgrestError } from "@supabase/supabase-js";
import Image from "next/image";
import { useRef, useContext } from "react";
import {
  ComposeTweetModalContext,
  ComposeTweetModalContextType,
} from "../context/ComposeTweetModalContext";
import CustomTextArea from "./CustomTextArea";

const ComposeTweetClient = ({
  user,
  serverAction,
}: {
  user: Profile;
  serverAction: (formData: FormData) => Promise<PostgrestError | null>;
}) => {
  const tweetTextRef = useRef<HTMLTextAreaElement>(null);
  const tweetMaxLength = 280;

  const { showComposeTweetModal, changeComposeModal } = useContext(
    ComposeTweetModalContext
  ) as ComposeTweetModalContextType;

  const postTweet = async (formData: FormData) => {
    if (
      tweetTextRef.current &&
      tweetTextRef.current.value !== "" &&
      tweetTextRef.current.value.length <= tweetMaxLength
    ) {
      try {
        const responseError = await serverAction(formData);
        tweetTextRef.current.value = "";

        if (showComposeTweetModal) changeComposeModal(false);

        if (responseError) {
          console.log(responseError.message);
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
            src={user.avatar_url}
            width={40}
            height={40}
            className="rounded-full"
            alt="Profile Image"
          />
        </div>

        <CustomTextArea
          formAction={postTweet}
          txtAreaTextRef={tweetTextRef}
          buttonText="Post"
          txtAreaPlaceholder="What is happening?!"
          txtAreaName="tweetText"
        />
      </div>
    </>
  );
};

export default ComposeTweetClient;
