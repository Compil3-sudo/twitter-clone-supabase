import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InfiniteFeed from "@/components/InfiniteFeed";
import MainHeader from "@/components/client-components/MainHeader";
import ComposeTweetServer from "@/components/server-components/ComposeTweetServer";
import Tweet from "@/components/client-components/Tweet";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)")
    .order("created_at", { ascending: false })
    .limit(10);

  const tweets = data?.map((tweet: any) => ({
    ...tweet,
    user_has_liked: !!tweet.likes.find(
      (like: any) => like.user_id === user?.id
    ),
    likes: tweet.likes.length,
  }));

  const help = tweets?.map((tweet) => tweet.text);
  console.log("Home server: ", help);

  // IMPORTANT:
  // ROUTING: - dynamic tweet page
  // /username/tweet/[tweetId]
  // CLICK ON REPLY:
  // /REPLYAUTHOR-USERNAME/tweet/[replyId]

  return (
    <>
      <MainHeader />
      <ComposeTweetServer user={user} />
      {/* <div className="flex flex-col items-center">
        {tweets?.map((tweet: any) => (
          <Tweet key={tweet.id} user={user} tweet={tweet} />
        ))}
      </div> */}
      <InfiniteFeed user={user} firstTweetsPage={tweets} />
    </>
  );
}
