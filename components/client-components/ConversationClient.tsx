"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ArrowHeader from "./ArrowHeader";
import ComposeMessageClient from "./ComposeMessageClient";
import MessageMedia from "./MessageMedia";

const ConversationClient = ({
  messages,
  chatTitle,
  chatParticipantProfile,
  serverAction,
}: {
  messages: Message[] | null;
  chatTitle: string;
  chatParticipantProfile: Profile | null;
  serverAction: (formData: FormData) => Promise<PostgrestError | null>;
}) => {
  if (!chatParticipantProfile) return;

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [messages?.length]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <>
      <ArrowHeader title={`Conversation with ${chatTitle}`} />
      <div className="flex flex-col flex-grow justify-between h-full overflow-auto no-scrollbar">
        <div className="flex flex-col">
          {messages?.map((message) =>
            // message author is other chat participant
            message.user_id === chatParticipantProfile.id ? (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.media_id ? "aspect-square" : "max-w-fit"
                } w-3/4 border p-2 m-2 rounded-xl bg-[#26292B]`}
              >
                {message.media_id && <MessageMedia message={message} />}
                <span className="break-words">
                  {chatParticipantProfile.name}: {message.text}
                </span>
                <span className="text-left">
                  {/* TODO: IMPORTANT: Either fix timezone or remove time completely */}
                  {/* {message.created_at.slice(11, 19)} */}
                </span>
              </div>
            ) : (
              // message author is current user
              <div
                key={message.id}
                className={`self-end flex flex-col ${
                  message.media_id ? "aspect-square" : "max-w-fit"
                } w-3/4 border p-2 m-2 rounded-xl bg-blue-500`}
              >
                {message.media_id && <MessageMedia message={message} />}
                <span className="break-words">{message.text}</span>
                <span className="text-right">
                  {/* TODO: IMPORTANT: Either fix timezone or remove time completely */}
                  {/* {message.created_at.slice(11, 19)} */}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      <ComposeMessageClient serverAction={serverAction} />
      <div ref={chatBottomRef} />
    </>
  );
};

export default ConversationClient;
