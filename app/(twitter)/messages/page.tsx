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
  const supabase = createServerComponentClient<Database>({ cookies });

  //   create or replace function is_conversation_participant(conversation_id uuid)
  //   returns boolean as $$
  //    select exists(
  //     select 1
  //     from user_conversations
  //     where conversation_id = is_conversation_participant.conversation_id and user_id = auth.uid()
  //    );
  // $$ language sql security definer;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: conversations, error: err } = await supabase
    .from("user_conversations")
    .select("*")
    .neq("user_id", user.id); // filter out own profile, no conversation with yourself :)

  // TODO: need a RCP function to fetch only the last message of each conversation with group by

  const usersConversationDictionary: Record<string, string> = {};

  conversations?.forEach((conversation) => {
    usersConversationDictionary[conversation.user_id] =
      conversation.conversation_id;
  });

  const chatParticipantIds =
    conversations?.map((conversation) => conversation.user_id) || null;

  const { data: chatParticipants, error: chatParticipantsError } =
    await supabase
      .from("profiles")
      .select("*")
      .in("id", chatParticipantIds as string[]);

  const createNewChat = async (participantId: Profile["id"]) => {
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
        .insert({ user_id: participantId, conversation_id: conversationId });

    revalidatePath("/messages");

    if (conversationError) throw conversationError;
    if (addCurrentUserError) throw addCurrentUserError;
    if (addParticipantError) throw addParticipantError;

    redirect(`/messages/${conversationId}`);
  };

  return (
    <div>
      <ArrowHeader title="Messages" />

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
