import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Login from "./login/page";
import { cookies } from "next/headers";
import ComposeTweet from "@/components/ComposeTweet";
import Like from "@/components/Like";

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
        <div key={tweet.id} className="p-10">
          <p>Author: {tweet.author.username}</p>
          <p>Tweet: {tweet.text}</p>
          <p>Likes Count: {tweet.likes}</p>
          <p>Liked by Author: {tweet.author_has_liked ? "true" : "false"}</p>
          <Like user={user} tweet={tweet} />
        </div>
      ))}
      <h1>-</h1>
      <h1>-</h1>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
