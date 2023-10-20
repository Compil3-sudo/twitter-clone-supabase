// "use client"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// import {useState} from "react"

const Messages = async () => {
  // const [messages, setMessages] = useState(serverMessages);
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: messages, error } = await supabase.from("messages").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(messages);

  const { data: conversations, error: err } = await supabase
    .from("user_conversations")
    .select("*");

  console.log(conversations);

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
    </div>
  );
};

export default Messages;
