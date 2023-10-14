import NestedRepliesServer from "@/components/server-components/NestedRepliesServer";
import Tweet from "@/components/client-components/Tweet";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ArrowHeader from "@/components/client-components/ArrowHeader";
import ComposeReplyServer from "@/components/server-components/ComposeReplyServer";

export const dynamic = "force-dynamic";

const TweetPage = async ({
  params,
}: {
  params: { username: string; tweetId: string };
}) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const username = params.username;
  const tweetId = params.tweetId;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (!currentUserProfile) redirect("/");

  // TODO: ONLY PASS USER'S USERNAME AND ID
  // TWEET COMPONENT NEEDS USER'S USERNAME
  // OTHER COMPONENTS ONLY NEED THE USER'S ID

  const { data: tweet, error: tweetError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
    .eq("id", tweetId)
    .single();

  if (tweetError) {
    console.log(tweetError);
  }

  if (!tweet) redirect("/");

  const mappedTweet = {
    ...tweet,
    author: tweet.author!,
    user_has_liked: !!tweet.likes.find(
      (like) => like.user_id === currentUserProfile.id
    ),
    likes: tweet.likes.length,
    replies: tweet.replies.length,
  };

  const { data: repliesData, error: repliesError } = await supabase
    .from("replies")
    // .select("*, author: profiles(*), likes(user_id), nestedReplies: replies(*)")
    .select("*, author: profiles(*), likes(user_id)")
    .eq("tweet_id", mappedTweet.id)
    .order("created_at", { ascending: false });

  const tweetReplies =
    repliesData?.map((reply) => ({
      ...reply,
      author: reply.author!, // there is no way for a reply to exist without an author, because each tweet has a user_id (:= author's id)
      user_has_liked: !!reply.likes.find(
        (like) => like.user_id === currentUserProfile.id
      ),
      likes: reply.likes.length,
    })) ?? [];

  // console.log(tweetReplies);

  return (
    <>
      {/* POST HEADER */}
      <ArrowHeader title="Post" />
      {/* POST HEADER */}
      {/* TODO: OPTIONAL: make tweet view page instead of reusing Tweet component ? */}
      <Tweet
        userId={currentUserProfile.id}
        tweet={mappedTweet}
        ComposeReply={<ComposeReplyServer user={currentUserProfile} />}
      />
      <h2>add bookmark somewhere</h2>
      <ComposeReplyServer user={currentUserProfile} />

      {/* TODO: IMPORTANT: make infinite scroll component - load pagination, fetch replies in batches */}

      {tweetReplies.map((reply) => (
        // TODO: MAKE REPLY COMPONENT - VERY SIMILAR TO TWEET...
        // OR make TWEET component into POST component
        // can be either a tweet or a reply ?

        // TODO: IMPORTANT - FIX THIS
        // CAN NOT USE THE SAME COMPONENT
        // IT TRIES TO ACCESS TWEETS TABLE
        <Tweet
          key={reply.id}
          userId={currentUserProfile.id}
          tweet={reply}
          ComposeReply={<ComposeReplyServer user={currentUserProfile} />}
        />
      ))}

      {
        // tweetReplies.data?.map((reply) => (
        //   <div key={reply.id} className="px-10">
        //     <p className="py-2">
        //       {/* on reply btn click
        //           - go to a new Tweet Page
        //           - pass the reply as a "main parent reply" prop
        //           - if the tweet has a "main parent reply": change the view
        //             - main parent reply has a line => directly under tweet content
        //           - this becomes the "tweetReplies" basically
        //           - add (insert) nested replies to the main reply
        //       */}
        //       {reply.text} <button className="text-green-500">REPLYBUTTON</button>
        //     </p>
        //     {/* {reply.nestedReplies.length > 0 && (
        //       <NestedRepliesServer parentReply={reply} />
        //     )} */}
        //     {reply.nestedReplies && <NestedRepliesServer parentReply={reply} />}
        //   </div>
        // ))
      }
    </>
  );
};

export default TweetPage;
