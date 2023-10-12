import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import ComposeTweetClient from "../client-components/ComposeTweetClient";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const ComposeTweetServer = async ({ user }: { user: Profile }) => {
  const submitTweet = async (formData: FormData) => {
    "use server";

    const supabase = createServerActionClient<Database>({ cookies });

    const tweetText = formData.get("tweetText")?.toString(); // textArea name
    const media = formData.get("media") as File;

    if (!tweetText && !media) return null;

    let mediaId = null;

    if (media) {
      mediaId = uuidv4();

      const fileExt = media.name.split(".").pop();
      const filePath = `${user.id}/${mediaId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(`tweets`)
        .upload(filePath, media);

      if (uploadError) throw uploadError;
    }

    // user should actually be able to post a tweet with media and no text
    // if (!tweetText) return null;
    // if (tweetText.toString() === "") return null;

    const { error } = await supabase.from("tweets").insert({
      user_id: user.id,
      text: tweetText,
      media_id: mediaId,
    });

    if (error) {
      console.log(error);
    }

    revalidatePath("/home");
    return error;
  };

  return <ComposeTweetClient user={user} serverAction={submitTweet} />;
};

export default ComposeTweetServer;
