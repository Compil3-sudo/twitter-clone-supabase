import ArrowHeader from "@/components/client-components/ArrowHeader";
import MessagesClient from "@/components/client-components/MessagesClient";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

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
  if (!user) redirect("/");

  // console.log(messages);

  const { data: conversations, error: err } = await supabase
    .from("user_conversations")
    .select("*")
    .neq("user_id", user.id); // filter out own profile, no conversation with yourself :)

  // TODO: need a RCP function to fetch only the last message of each conversation with group by

  // console.log(conversations);

  const usersConversationDictionary: Record<string, string> = {};

  conversations?.forEach((conversation) => {
    usersConversationDictionary[conversation.user_id] =
      conversation.conversation_id;
  });

  const chatParticipantIds =
    conversations?.map((conversation) => conversation.user_id) || null;

  // console.log(chatParticipantIds);

  const { data: chatParticipants, error: chatParticipantsError } =
    await supabase
      .from("profiles")
      .select("*")
      .in("id", chatParticipantIds as string[]);

  // console.log(chatParticipants);

  const createNewChat = async (id: Profile["id"]) => {
    "use server";

    const supabaseActionServer = createServerActionClient<Database>({
      cookies,
    });

    // create a conversationId in conversations with type: direct_message (one-to-one chat)
    const conversationId = uuidv4();
    const { data: conversation, error: conversationError } =
      await supabaseActionServer
        .from("conversations")
        .insert({ id: conversationId, type: "direct_message" });

    // add current user and selected participant to chat
    const { data: addCurrentUser, error: addCurrentUserError } =
      await supabaseActionServer
        .from("user_conversations")
        .insert({ user_id: user.id, conversation_id: conversationId });

    const { data: addParticipant, error: addParticipantError } =
      await supabaseActionServer
        .from("user_conversations")
        .insert({ user_id: id, conversation_id: conversationId });

    console.log(conversationError);
    console.log(addCurrentUserError);
    console.log(addParticipantError);

    revalidatePath("/messages");

    if (conversationError) throw conversationError;
    if (addCurrentUserError) throw addCurrentUserError;
    if (addParticipantError) throw addParticipantError;
  };

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
    <div>
      <ArrowHeader title="Messages" />
      <h1 className="text-xl p-2">Work in progress</h1>
      {/* {messages?.map((message) => (
        <div key={message.id} className="my-6 mx-4">
          <h2>id: {message.id}</h2>
          <h2>conversation_id: {message.conversation_id}</h2>
          <h2>user_id: {message.user_id}</h2>
          <h2 className="font-bold">text: {message.text}</h2>
          <h2>created_at: {message.created_at}</h2>
        </div>
      ))} */}

      <MessagesClient
        userId={user!.id}
        chatParticipants={chatParticipants}
        usersConversationDictionary={usersConversationDictionary}
        createNewChat={createNewChat}
      />
    </div>
  );
};

export default Messages;
