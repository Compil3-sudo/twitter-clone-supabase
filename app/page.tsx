import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Login from "./login/page";
import { cookies } from "next/headers";
import ComposeTweet from "@/components/client-components/ComposeTweet";
import Tweet from "@/components/client-components/Tweet";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)");

  const tweets = data?.map((tweet) => ({
    ...tweet,
    author_has_liked: !!tweet.likes.find(
      (like: any) => like.user_id === user?.id
    ),
    likes: tweet.likes.length,
  }));

  // IMPORTANT:
  // ROUTING: - dynamic tweet page
  // /username/tweet/[tweetId]
  // CLICK ON REPLY:
  // /REPLYAUTHOR-USERNAME/tweet/[replyId]

  return (
    <>
      <h1>Hello World</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      {/* currently also contains logout - separate later */}
      <Login />
      <h1>-</h1>
      <h1>-</h1>
      <h2>Create new Tweet</h2>
      <ComposeTweet user={user} />
      <h1>-</h1>
      <h1>-</h1>
      {tweets?.map((tweet) => (
        <Tweet key={tweet.id} user={user} tweet={tweet} />
      ))}
      <h1>-</h1>
      <h1>-</h1>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
