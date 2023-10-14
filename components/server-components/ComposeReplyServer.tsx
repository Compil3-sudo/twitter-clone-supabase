import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import ComposeReplyClient from "../client-components/ComposeReplyClient";
import { replyTweetType } from "../context/ComposeReplyModalContext";

export const dynamic = "force-dynamic";

const ComposeReplyServer = async ({ user }: { user: Profile }) => {
  const submitTweet = async (formData: FormData, tweet: replyTweetType) => {
    "use server";

    const supabase = createServerActionClient<Database>({ cookies });

    let replyText = formData.get("replyText"); // textArea name
    const media = formData.get("media") as File;
    let fileExt = null;

    if (!replyText && !media) return null;

    let mediaId = null;
    if (!replyText) {
      replyText = null;
    } else {
      replyText = replyText.toString();
    }

    if (media) {
      mediaId = uuidv4();

      fileExt = media.name.split(".").pop();
      const filePath = `${user.id}/${mediaId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(`tweets`)
        .upload(filePath, media);

      if (uploadError) {
        console.log(uploadError);
        throw uploadError;
      }
    }

    const { error } = await supabase.from("replies").insert({
      user_id: user.id,
      tweet_id: tweet.id,
      text: replyText,
      media_id: mediaId,
      media_extension: fileExt,
    });

    if (error) {
      console.log(error);
    }

    revalidatePath(`/${tweet.author.username}/tweet/${tweet.id}`);
    return error;
  };

  return <ComposeReplyClient user={user} serverAction={submitTweet} />;
};

export default ComposeReplyServer;
