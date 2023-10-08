import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InfiniteFeed from "@/components/client-components/InfiniteFeed";
import MainHeader from "@/components/client-components/MainHeader";
import ComposeTweetServer from "@/components/server-components/ComposeTweetServer";
import InfiniteFeedProvider from "@/components/client-components/InfiniteFeedContext";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // TODO IMPORTANT: make user state management across the entire app
  // => only fetch currentUser and his profile once after login after session
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  // REMOVE HOTFIX AFTER USER STATE MANAGEMENT
  if (!currentUserProfile) redirect("/");

  const { data, error } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false })
    .limit(10);

  const recentTweets =
    data?.map((tweet) => ({
      ...tweet,
      author: tweet.author!, // there is no way for a tweet to exist without an author, because eacht tweet has a user_id (:= author's id)
      user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
      likes: tweet.likes.length,
    })) ?? [];

  // fetch who the user is following
  const { data: userFollowing } = await supabase
    .from("followers")
    .select("followed_id")
    .eq("follower_id", currentUserProfile.id);

  const userFollowingIds =
    userFollowing?.map((followingId) => followingId.followed_id) || [];

  // only fetch tweets, where tweet author is followed by currentUser
  const { data: following, error: followingError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .in("user_id", userFollowingIds)
    .order("created_at", { ascending: false })
    .limit(10);

  const followingTweets =
    following?.map((tweet) => ({
      ...tweet,
      author: tweet.author!, // there is no way for a tweet to exist without an author, because eacht tweet has a user_id (:= author's id)
      user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
      likes: tweet.likes.length,
    })) ?? [];

  // IMPORTANT:
  // ROUTING: - dynamic tweet page
  // /username/tweet/[tweetId]
  // CLICK ON REPLY:
  // /REPLYAUTHOR-USERNAME/tweet/[replyId]

  return (
    <>
      <InfiniteFeedProvider>
        <MainHeader />
        <ComposeTweetServer user={currentUserProfile} />
        <InfiniteFeed
          userId={currentUserProfile.id}
          firstTweetsPage={recentTweets}
          firstFollowingTweetsPage={followingTweets}
          userFollowingIds={userFollowingIds}
        />
      </InfiniteFeedProvider>
    </>
  );
}
