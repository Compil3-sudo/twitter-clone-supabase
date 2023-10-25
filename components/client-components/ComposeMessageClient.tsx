"use client";

import { PostgrestError } from "@supabase/supabase-js";
import { useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { GoFileMedia } from "react-icons/go";
import { VscClose } from "react-icons/vsc";

const ComposeMessageClient = ({
  serverAction,
}: {
  serverAction: (formData: FormData) => Promise<PostgrestError | null>;
}) => {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const messageMaxLength = 280;

  const handleChange = () => {
    if (messageRef.current) {
      messageRef.current.style.height = "auto";
      messageRef.current.style.height = `${Math.min(
        messageRef.current.scrollHeight,
        messageMaxLength
      )}px`;

      if (submitting || (!messageRef.current.value.length && !media)) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    }
  };

  const uploadMedia: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    setUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image or video to upload.");
    }

    const selectedMedia = event.target.files[0];
    setMedia(selectedMedia);
    setUploading(false);
    setIsButtonDisabled(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("messageInput", messageRef.current!.value);
    if (media) {
      formData.append("media", media);
    }

    sendMessage(formData);
  };

  const sendMessage = async (formData: FormData) => {
    setSubmitting(true);
    if (
      messageRef.current &&
      messageRef.current.value.length <= messageMaxLength
    ) {
      try {
        const responseError = await serverAction(formData);
        messageRef.current.value = "";
        setMedia(null);

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
    <form onSubmit={handleSubmit} className="p-2 mb-2">
      <div className="flex flex-row w-full bg-[#16181C] rounded-xl items-center p-1">
        <label
          htmlFor="addMedia"
          className="my-auto p-2 hover:bg-blue-500/20 rounded-full transition ease-out text-blue-500 cursor-pointer"
        >
          <GoFileMedia size={20} />
          <input
            type="file"
            id="addMedia"
            name="media"
            className="hidden absolute"
            accept="image/* video/mp4"
            onChange={uploadMedia}
            disabled={uploading}
          />
        </label>

        {/* TODO: OPTIONAL: add emojis ? */}

        <div className="flex flex-col w-full">
          {media && (
            <div className="my-4 relative w-[200px]">
              <div
                onClick={() => {
                  setMedia(null);
                  if (!messageRef.current?.value.length || submitting)
                    setIsButtonDisabled(true);
                }}
                className="absolute right-2 top-2 w-fit p-2 bg-slate-700 hover:bg-opacity-90 rounded-full cursor-pointer"
              >
                <VscClose size={20} />
              </div>
              {media.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Media Preview"
                  className="w-[150px] h-[150px] object-contain"
                />
              ) : media.type.startsWith("video/") ? (
                <video controls>
                  <source src={URL.createObjectURL(media)} type={media.type} />
                </video>
              ) : null}
            </div>
          )}

          <textarea
            ref={messageRef}
            onChange={handleChange}
            maxLength={messageMaxLength}
            name={"messageInput"}
            className="flex-grow w-full p-1 pl-4 bg-[#16181C] no-scrollbar border-none outline-none resize-none"
            placeholder={"Start a new message"}
            rows={1}
          />
        </div>

        <button
          disabled={isButtonDisabled}
          type="submit"
          className={`${
            isButtonDisabled
              ? "bg-opacity-50 text-blue-500/50 cursor-default"
              : "hover:bg-blue-500/20 transition ease-in-out"
          } rounded-full text-blue-500 p-2`}
        >
          <AiOutlineSend size={20} />
        </button>
      </div>
    </form>
  );
};

export default ComposeMessageClient;
