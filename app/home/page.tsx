import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import InfiniteFeed from "@/components/InfiniteFeed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)")
    .order("created_at", { ascending: false });

  const tweets = data?.map((tweet) => ({
    ...tweet,
    author_has_liked: !!tweet.likes.find(
      (like: any) => like.user_id === user?.id
    ),
    likes: tweet.likes.length,
  }));

  if (!user) {
    redirect("/");
  }

  // IMPORTANT:
  // ROUTING: - dynamic tweet page
  // /username/tweet/[tweetId]
  // CLICK ON REPLY:
  // /REPLYAUTHOR-USERNAME/tweet/[replyId]

  return (
    <>
      <div className="flex">
        <LeftSidebar user={user} />

        <InfiniteFeed user={user} tweets={tweets} />

        {/* right sidebar */}
        <div>
          <div className="top-0 fixed">some content</div>
        </div>
      </div>
    </>
  );
}
