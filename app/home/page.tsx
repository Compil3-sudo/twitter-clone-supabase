import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ComposeTweet from "@/components/client-components/ComposeTweet";
import Tweet from "@/components/client-components/Tweet";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";

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
        {/* infinite tweets feed */}
        <main className="flex flex-col max-w-[600px] w-full h-full mx-2 border-l border-r">
          {/* TOP HEADER */}
          <div className="top-0 sticky flex border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950">
            <div className="flex flex-col w-full">
              <h1 className="text-lg p-4 font-bold">Home</h1>
              <div className="flex flex-row">
                <div className="w-1/2 flex justify-center hover:bg-white/10">
                  <button className="border-blue-500 border-b-4 py-4">
                    For You
                  </button>
                </div>
                <div className="w-1/2 flex justify-center hover:bg-white/10">
                  <button className="hover:border-blue-500 border-transparent border-b-4 py-4">
                    Following
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* TOP HEADER */}
          <ComposeTweet user={user} />
          {/* TWEETS FEED */}
          <div className="flex flex-col items-center">
            <h1>.</h1>
            <h1>.</h1>
            {tweets?.map((tweet) => (
              <Tweet key={tweet.id} user={user} tweet={tweet} />
            ))}
            <h1>-</h1>
            <h1>-</h1>
            <pre className="flex flex-wrap w-fit">
              {JSON.stringify(tweets, null, 2)}
            </pre>
          </div>
          {/* TWEETS FEED */}
        </main>
        {/* infinite tweets feed */}

        {/* right sidebar */}
        <div>
          <div className="top-0 fixed">some content</div>
        </div>
      </div>
    </>
  );
}
