// "use client"
import WhoToFollowProfile from "@/components/client-components/WhoToFollowProfile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

// import {useState} from "react"

const Messages = async () => {
  // const [messages, setMessages] = useState(serverMessages);
  const supabase = createServerComponentClient<Database>({ cookies });

  //   create or replace function is_conversation_participant(conversation_id uuid)
  //   returns boolean as $$
  //    select exists(
  //     select 1
  //     from user_conversations
  //     where conversation_id = is_conversation_participant.conversation_id and user_id = auth.uid()
  //    );
  // $$ language sql security definer;

  const { data: messages, error } = await supabase.from("messages").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(messages);

  const { data: conversations, error: err } = await supabase
    .from("user_conversations")
    .select("*");

  console.log(conversations);

  const chatParticipantIds = conversations?.map(
    (conversation) => conversation.user_id
  );

  console.log(chatParticipantIds);

  const { data: chatParticipants, error: chatParticipantsError } =
    await supabase
      .from("profiles")
      .select("*")
      .in("id", chatParticipantIds as string[]);

  console.log(chatParticipants);

  // const conversationWith = conversations?.map((conversation) => {
  //   const isSender = conversation.author_id === user?.id;

  //   if (isSender) {
  //     return conversation.target_id;
  //   }
  //   return conversation.author_id;
  // });

  // console.log(conversations);
  // console.log(conversationWith);

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
    <div>
      <h1 className="text-3xl p-2">Messages</h1>
      <h1 className="text-xl p-2">Page not implemented yet</h1>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      {chatParticipants?.map((participant) => (
        <div
          key={participant.id}
          // show last message ?
          // onClick={} // navigate to conversation with messages. /messages/chatParticipantId ?
          className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200 cursor-pointer"
        >
          <div className="flex-none overflow-hidden w-10 h-10 my-auto">
            <div className="w-full h-full relative">
              <Image
                src={participant.avatar_url}
                fill
                className="rounded-full object-cover"
                alt="Profile Image"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex flex-col w-full">
              <div className="flex w-full">
                <div className="flex flex-col w-full">
                  <h2>{participant.name}</h2>
                  <h2 className="text-gray-500 text-sm">
                    @{participant.username}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
