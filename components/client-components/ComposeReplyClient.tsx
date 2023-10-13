"use client";

import React, { useContext, useRef, useState } from "react";
import CustomTextArea from "./CustomTextArea";
import Image from "next/image";
import { PostgrestError } from "@supabase/supabase-js";
import {
  ComposeTweetModalContext,
  ComposeTweetModalContextType,
} from "../context/ComposeTweetModalContext";

const ComposeReplyClient = ({
  user,
  serverAction,
}: {
  user: Profile;
  serverAction: (formData: FormData) => Promise<PostgrestError | null>;
}) => {
  const replyTextRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const replyMaxLength = 280;

  // COMPOSE REPLY MODAL:
  const { showComposeTweetModal, changeComposeModal } = useContext(
    ComposeTweetModalContext
  ) as ComposeTweetModalContextType;

  const sendReply = async (formData: FormData) => {
    setSubmitting(true);
    if (
      replyTextRef.current &&
      replyTextRef.current.value.length <= replyMaxLength
    ) {
      try {
        const responseError = await serverAction(formData);
        replyTextRef.current.value = "";
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
          formAction={sendReply}
          txtAreaTextRef={replyTextRef}
          media={media}
          onUploadMedia={(uploadMedia: File) => setMedia(uploadMedia)}
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
