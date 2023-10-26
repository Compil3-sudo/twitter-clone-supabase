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
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to save the scroll position to local storage
  const saveScrollPosition = () => {
    if (chatContainerRef.current) {
      localStorage.setItem(
        "chatScrollPosition",
        chatContainerRef.current.scrollHeight.toString()
      );
    }
  };

  // Function to restore the scroll position from local storage
  const restoreScrollPosition = () => {
    const savedPosition = localStorage.getItem("chatScrollPosition");
    if (savedPosition) {
      // window.element.scrollTo(0, parseInt(savedPosition));
      document
        .getElementById("chatContainer")
        ?.scroll(0, parseInt(savedPosition));
    }
  };

  useEffect(() => {
    // Restore scroll position when the component mounts
    restoreScrollPosition();
  }, []);

  useEffect(() => {
    // Save scroll position when the component unmounts
    return saveScrollPosition;
  }, []);

  // useEffect(() => {
  //   // Scroll to the bottom when the component mounts
  //   if (chatContainerRef.current) {
  //     // chatContainerRef.current.scrollTop =
  //     //   chatContainerRef.current.scrollHeight;
  //     chatContainerRef.current.scrollIntoView();
  //     // window.scrollTo({ top: chatContainerRef.current.scrollHeight });
  //   }
  // }, []);

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
          // chatContainerRef.current?.scrollIntoView();
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
        <div
          ref={chatContainerRef}
          id="chatContainer"
          className="flex flex-col overflow-auto no-scrollbar"
        >
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
          {/* <div ref={chatContainerRef} /> */}
        </div>

        <ComposeMessageClient serverAction={serverAction} />
      </div>
    </>
  );
};

export default ConversationClient;
