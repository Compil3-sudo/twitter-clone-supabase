"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import CustomTextArea from "./CustomTextArea";
import Image from "next/image";
import { PostgrestError } from "@supabase/supabase-js";
import {
  ComposeReplyModalContext,
  ComposeReplyModalContextType,
  replyTweetType,
} from "../context/ComposeReplyModalContext";
import { useParams } from "next/navigation";

const ComposeReplyClient = ({
  user,
  serverAction,
}: {
  user: Profile;
  serverAction: (
    formData: FormData,
    tweet: replyTweetType
  ) => Promise<PostgrestError | null>;
}) => {
  const replyTextRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const params = useParams();
  const {
    showComposeReplyModal,
    changeReplyModal,
    replyTweet,
    changeReplyTweet,
  } = useContext(ComposeReplyModalContext) as ComposeReplyModalContextType;
  const replyMaxLength = 280;

  useEffect(() => {
    if (params.username && params.tweetId) {
      const helper = {
        author: {
          username: params.username.toString(),
        },
        id: params.tweetId.toString(),
      };
      changeReplyTweet(helper);
    }
  }, []);

  const sendReply = async (formData: FormData) => {
    setSubmitting(true);
    if (
      replyTextRef.current &&
      replyTextRef.current.value.length <= replyMaxLength
    ) {
      try {
        const responseError = await serverAction(formData, replyTweet!);
        replyTextRef.current.value = "";
        setMedia(null);

        if (showComposeReplyModal) changeReplyModal(false);

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
              objectFit="cover"
              layout="fill"
              className="rounded-full"
              alt="Profile Image"
            />
          </div>
        </div>

        <CustomTextArea
          formAction={sendReply}
          txtAreaTextRef={replyTextRef}
          media={media}
          onUploadMedia={(uploadMedia: File) => setMedia(uploadMedia)}
          onRemoveMedia={() => setMedia(null)}
          buttonText="Reply"
          submitting={submitting}
          txtAreaPlaceholder="Post your reply"
          txtAreaName="replyText"
        />
      </div>
    </>
  );
};

export default ComposeReplyClient;
