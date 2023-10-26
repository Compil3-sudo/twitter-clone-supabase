import ArrowHeader from "@/components/client-components/ArrowHeader";
import ComposeMessageClient from "@/components/client-components/ComposeMessageClient";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

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
  if (!user) redirect("/");

  const { data: conversation, error: err } = await supabase
    .from("user_conversations")
    .select("*")
    .eq("conversation_id", conversation_id)
    .neq("user_id", user.id);

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

  const sendMessage = async (formData: FormData) => {
    "use server";

    const supabaseServerAction = createServerActionClient<Database>({
      cookies,
    });

    let messageText = formData.get("messageInput"); // textArea name
    const media = formData.get("media") as File;
    let fileExt = null;

    if (!messageText && !media) return null;

    let mediaId = null;
    if (!messageText) {
      messageText = null;
    } else {
      messageText = messageText.toString();
    }

    if (media) {
      mediaId = uuidv4();

      fileExt = media.name.split(".").pop();
      const filePath = `${user.id}/${mediaId}.${fileExt}`;

      const { error: uploadError } = await supabaseServerAction.storage
        .from(`tweets`)
        .upload(filePath, media);

      if (uploadError) {
        console.log(uploadError);
        throw uploadError;
      }
    }

    const { error } = await supabaseServerAction.from("messages").insert({
      conversation_id: conversation_id,
      user_id: user.id,
      text: messageText,
      media_id: mediaId,
      media_extension: fileExt,
    });

    if (error) {
      console.log(error);
    }

    revalidatePath(`/messages/${conversation_id}`);
    return error;
  };

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
        </div>

        <ComposeMessageClient serverAction={sendMessage} />
      </div>
    </>
  );
};

export default Conversation;
