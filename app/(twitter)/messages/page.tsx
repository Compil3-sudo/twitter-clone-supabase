import ArrowHeader from "@/components/client-components/ArrowHeader";
import MessagesClient from "@/components/client-components/MessagesClient";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  return (
    <div>
      <ArrowHeader title="Messages" />

      <MessagesClient
        userId={user!.id}
        chatParticipants={chatParticipants}
        usersConversationDictionary={usersConversationDictionary}
      />
    </div>
  );
};

export default Messages;
