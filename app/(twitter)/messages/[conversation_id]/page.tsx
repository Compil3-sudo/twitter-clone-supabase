import ConversationClient from "@/components/client-components/ConversationClient";
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
  let chatParticipantProfile: Profile | null = null;

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
      <ConversationClient
        messages={messages}
        chatTitle={chatTitle}
        chatParticipantProfile={chatParticipantProfile}
        serverAction={sendMessage}
      />
    </>
  );
};

export default Conversation;
