"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ConversationClient = ({
  messages,
  chatParticipantProfile,
}: {
  messages: Message[] | null;
  chatParticipantProfile: Profile | null;
}) => {
  // const [messages, setMessages] = useState(serverMessages);
  if (!chatParticipantProfile) return;

  const supabase = createClientComponentClient();
  const router = useRouter();

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
  // FOR REAL TIME UPDATES:

  // useEffect(() => {
  //   setMessages(serverMessages);
  // }, [serverMessages]);

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("*")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "messages" },
  //       (payload) => {
  //         const newMessage = payload.new as Message;

  //         if (!messages.find((message) => message.id === newMessage.id)) {
  //           setMessages([...messages, newMessage]);
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase, messages]);

  return (
    <>
      {messages?.map((message) =>
        message.user_id === chatParticipantProfile.id ? (
          <div
            key={message.id}
            className="flex flex-col p-2 m-2 w-fit border rounded-xl bg-[#26292B]"
          >
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
            <h2>Me: {message.text}</h2>
            <span className="text-right">
              {/* TODO: IMPORTANT: Either fix timezone or remove time completely */}
              {/* {message.created_at.slice(11, 19)} */}
            </span>
          </div>
        )
      )}
    </>
  );
};

export default ConversationClient;
