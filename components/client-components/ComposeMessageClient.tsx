"use client";

import { PostgrestError } from "@supabase/supabase-js";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { GoFileMedia } from "react-icons/go";
import { VscClose } from "react-icons/vsc";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { BsEmojiSmile } from "react-icons/bs";

init({ data });

type EmojiType = {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
};

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
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const messageMaxLength = 401;

  const handleChange = () => {
    if (messageRef.current) {
      messageRef.current.style.height = "auto";
      messageRef.current.style.height = `${Math.min(
        messageRef.current.scrollHeight,
        messageMaxLength
      )}px`;

      setShowMaxWarning(false);
      if (messageRef.current.value.length === messageMaxLength) {
        setIsButtonDisabled(true);
        setShowMaxWarning(true);
        return;
      }

      if (submitting || (messageRef.current.value.trim() === "" && !media)) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      if (messageRef.current) {
        if (messageRef.current.value.length === messageMaxLength) return;
        // reset textarea height
        messageRef.current.style.height = "auto";
      }
      // Trigger the form submission with custom handleSubmit function
      // prevent spamming "Enter" => only 1 message is sent
      if (!isButtonDisabled) {
        setIsButtonDisabled(true);
        formRef.current?.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    }
  };

  const uploadMedia: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    setUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      setUploading(false);
      return;
    }

    const selectedMedia = event.target.files[0];
    setMedia(selectedMedia);
    setUploading(false);
    setIsButtonDisabled(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (messageRef.current) {
      const formData = new FormData();
      formData.append("messageInput", messageRef.current.value.trim());
      if (media) {
        formData.append("media", media);
      }

      sendMessage(formData);
    }
  };

  const addEmoji = (emoji: EmojiType) => {
    if (messageRef.current) {
      messageRef.current.value = messageRef.current.value + emoji.native;
      setIsButtonDisabled(false);
    }
  };

  const sendMessage = async (formData: FormData) => {
    setSubmitting(true);
    setIsButtonDisabled(true);
    if (
      messageRef.current &&
      messageRef.current.value !== "" &&
      messageRef.current.value.length < messageMaxLength
    ) {
      try {
        const responseError = await serverAction(formData);
        messageRef.current.value = "";
        setMedia(null);
        messageRef.current.style.height = "auto"; // reset textarea height

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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="pb-4 pt-2 px-2 border-t sticky bottom-0 bg-slate-950"
    >
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
        <div
          onClick={() => setShowEmojiMenu(true)}
          className="relative my-auto p-2 hover:bg-blue-500/20 rounded-full transition ease-out text-blue-500 cursor-pointer"
        >
          <BsEmojiSmile size={20} />
          {showEmojiMenu && (
            <div
              className={`absolute ${media ? "bottom-36" : "bottom-12"} left-0`}
            >
              <Picker
                data={data}
                onClickOutside={() => setShowEmojiMenu(false)}
                onEmojiSelect={(emoji: EmojiType) => addEmoji(emoji)}
                previewEmoji={"wave"}
              />
            </div>
          )}
        </div>

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
            onKeyDown={handleKeyDown}
            maxLength={messageMaxLength}
            name={"messageInput"}
            className="flex-grow w-full p-1 pl-4 bg-[#16181C] no-scrollbar border-none outline-none resize-none"
            placeholder={"Start a new message"}
            rows={1}
          />

          {showMaxWarning && (
            <span className="text-red-500 self-end py-2">
              Message too long.
            </span>
          )}
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
