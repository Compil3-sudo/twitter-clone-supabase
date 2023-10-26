"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ArrowHeader from "./ArrowHeader";
import ComposeMessageClient from "./ComposeMessageClient";

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

  const supabase = createClientComponentClient();
  const router = useRouter();
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({
        behavior: "smooth",
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
      <div className="flex flex-col justify-between h-screen">
        <div className="flex flex-col overflow-auto no-scrollbar">
          <ArrowHeader title={`Conversation with ${chatTitle}`} />

          {messages?.map((message) =>
            message.user_id === chatParticipantProfile.id ? (
              <div
                key={message.id}
                className="flex flex-col p-2 m-2 w-fit border rounded-xl bg-[#26292B]"
              >
                {/* TODO: IMPORTANT: Add message media */}
                <h2>
                  {chatParticipantProfile.name}: {message.text}
                </h2>
                <span className="text-left">
                  {/* TODO: IMPORTANT: Either fix timezone or remove time completely */}
                  {/* {message.created_at.slice(11, 19)} */}
                </span>
              </div>
            ) : (
              <div
                key={message.id}
                className="self-end flex flex-col w-fit border p-2 m-2 rounded-xl bg-blue-500"
              >
                {/* TODO: IMPORTANT: Add message media */}
                <h2>Me: {message.text}</h2>
                <span className="text-right">
                  {/* TODO: IMPORTANT: Either fix timezone or remove time completely */}
                  {/* {message.created_at.slice(11, 19)} */}
                </span>
              </div>
            )
          )}
          <div ref={chatBottomRef} />
        </div>

        <ComposeMessageClient serverAction={serverAction} />
      </div>
    </>
  );
};

export default ConversationClient;
