import NestedRepliesServer from "@/components/server-components/NestedRepliesServer";
import Tweet from "@/components/client-components/Tweet";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ComposeReply from "@/components/client-components/ComposeReply";
import ArrowHeader from "@/components/client-components/ArrowHeader";

export const dynamic = "force-dynamic";

const TweetPage = async ({
  params,
}: {
  params: { username: string; tweetId: string };
}) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const username = params.username;
  const tweetId = params.tweetId;

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (userError) {
    console.log(userError);
  }

  // TODO: ONLY PASS USER'S USERNAME AND ID
  // TWEET COMPONENT NEEDS USER'S USERNAME
  // OTHER COMPONENTS ONLY NEED THE USER'S ID

  const { data: tweet, error: tweetError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)")
    .eq("id", tweetId)
    .single();

  if (tweetError) {
    console.log(tweetError);
  }

  if (!tweet) redirect("/");

  const mappedTweet = {
    ...tweet,
    user_has_liked: !!tweet.likes.find((like) => like.user_id === user?.id),
    likes: tweet.likes.length,
  };

  const tweetReplies = await supabase
    .from("replies")
    .select("*, nestedReplies: replies(*)")
    .eq("tweet_id", mappedTweet.id);

  // console.log(tweetReplies);

  return (
    <>
      {/* POST HEADER */}
      <ArrowHeader title="Post" />
      {/* POST HEADER */}
      <Tweet user={user} tweet={mappedTweet} />
      <h2>add bookmark somewhere</h2>
      <ComposeReply user={user} tweet={tweet} />
      {tweetReplies.data?.map((reply) => (
        <div key={reply.id} className="px-10">
          <p className="py-2">
            {/* on reply btn click
                - go to a new Tweet Page
                - pass the reply as a "main parent reply" prop
                - if the tweet has a "main parent reply": change the view
                  - main parent reply has a line => directly under tweet content
                - this becomes the "tweetReplies" basically
                - add (insert) nested replies to the main reply
            */}
            {reply.text} <button className="text-green-500">REPLYBUTTON</button>
          </p>

          {/* {reply.nestedReplies.length > 0 && (
            <NestedRepliesServer parentReply={reply} />
          )} */}
          {reply.nestedReplies && <NestedRepliesServer parentReply={reply} />}
        </div>
      ))}
    </>
  );
};

export default TweetPage;
