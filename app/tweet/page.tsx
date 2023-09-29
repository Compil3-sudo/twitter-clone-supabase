import Tweet from "@/components/Tweet";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
const TweetPage = async () => {
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

  let firstTestTweet;

  if (tweets) {
    firstTestTweet = tweets[0];
  }

  const tweetReplies = await supabase
    .from("replies")
    .select("*, nestedReplies: replies(*)")
    .eq("tweet_id", firstTestTweet.id);

  console.log(tweetReplies);

  return (
    <>
      <div className="p-10">
        <h1>First tweet view page.</h1>
        <h2>Only fetches the first tweet and its replies</h2>
      </div>
      <Tweet user={user} tweet={firstTestTweet} />
      {tweetReplies.data?.map((reply) => (
        <div key={reply.id} className="px-10">
          <p className="py-2">{reply.text}</p>
          {reply.nestedReplies.length > 0
            ? reply.nestedReplies.map((item: any) => (
                <p key={item.id} className="px-8">
                  {item.text}
                </p>
              ))
            : null}
        </div>
      ))}
    </>
  );
};

export default TweetPage;
