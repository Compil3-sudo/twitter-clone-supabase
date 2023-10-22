import ArrowHeader from "@/components/client-components/ArrowHeader";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const Conversation = async ({
  params,
}: {
  params: { conversation_id: string };
}) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const conversation_id = params.conversation_id;

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  console.log(messages);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversation, error: err } = await supabase
    .from("user_conversations")
    .select("*")
    .eq("conversation_id", conversation_id)
    .neq("user_id", user!.id);

  const chatParticipantIds =
    conversation?.map((conversation) => conversation.user_id) || [];

  let chatTitle = "";
  let chatParticipantProfile: Profile;

  if (chatParticipantIds.length > 1) {
    chatTitle = "Group";
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", chatParticipantIds)
      .single();

    if (data) {
      chatTitle = data.name;
      chatParticipantProfile = data;
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between h-screen">
        <div className="flex flex-col">
          <ArrowHeader title={`Conversation with ${chatTitle}`} />

          {messages?.map((message) =>
            message.user_id === chatParticipantProfile.id ? (
              <div className="flex flex-col p-2 m-2 w-fit border rounded-xl bg-[#26292B]">
                <h2>
                  {chatParticipantProfile.name}: {message.text}
                </h2>
                <span className="text-left">
                  {message.created_at.slice(11, 19)}
                </span>
              </div>
            ) : (
              <div className="self-end flex flex-col w-fit border p-2 m-2 rounded-xl bg-blue-500">
                <h2>Me: {message.text}</h2>
                <span className="text-right">
                  {message.created_at.slice(11, 19)}
                </span>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col p-2">
          <input
            className=" w-full bottom-2 p-2 rounded-xl bg-[#16181C] outline-none"
            placeholder="Start a new message"
          />
        </div>
      </div>
    </>
  );
};

export default Conversation;
