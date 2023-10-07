import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import ComposeTweetClient from "../client-components/ComposeTweetClient";

export const dynamic = "force-dynamic";

const ComposeTweetServer = async ({ user }: { user: Profile }) => {
  const submitTweet = async (formData: FormData) => {
    "use server";

    const tweetText = formData.get("tweetText"); // textArea name
    if (!tweetText) return null;

    const supabase = createServerActionClient<Database>({ cookies });

    // TODO: validate insert - tweet content

    const { data, error } = await supabase.from("tweets").insert({
      user_id: user.id,
      text: tweetText.toString(),
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
