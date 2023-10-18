"use client";

import { PostgrestError } from "@supabase/supabase-js";
import Image from "next/image";
import { useRef, useContext, useState } from "react";
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
  const [media, setMedia] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const tweetMaxLength = 280;

  const { showComposeTweetModal, changeComposeModal } = useContext(
    ComposeTweetModalContext
  ) as ComposeTweetModalContextType;

  const postTweet = async (formData: FormData) => {
    setSubmitting(true);
    if (
      tweetTextRef.current &&
      tweetTextRef.current.value.length <= tweetMaxLength
    ) {
      try {
        const responseError = await serverAction(formData);
        tweetTextRef.current.value = "";
        setMedia(null);

        if (showComposeTweetModal) changeComposeModal(false);

        if (responseError) {
          console.log(responseError.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="flex py-4 px-4 space-x-2 border-b">
        <div className="flex-none overflow-hidden w-10 h-10">
          <div className="w-full h-full relative">
            <Image
              src={user.avatar_url}
              fill
              className="rounded-full object-cover"
              alt="Profile Image"
            />
          </div>
        </div>

        <CustomTextArea
          formAction={postTweet}
          txtAreaTextRef={tweetTextRef}
          media={media}
          onUploadMedia={(uploadMedia: File) => setMedia(uploadMedia)}
          onRemoveMedia={() => setMedia(null)}
          buttonText="Post"
          submitting={submitting}
          txtAreaPlaceholder="What is happening?!"
          txtAreaName="tweetText"
        />
      </div>
    </>
  );
};

export default ComposeTweetClient;
