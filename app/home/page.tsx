import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import InfiniteFeed from "@/components/InfiniteFeed";
import { BiSearch } from "react-icons/bi";

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
    user_has_liked: !!tweet.likes.find(
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
          <div className="top-0 fixed py-2">
            <div className="group flex bg-[#16181C] rounded-full p-2 mx-4 px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
              <BiSearch className="group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search"
                className="bg-[#16181C] outline-none focus:bg-slate-950"
              />
            </div>
            <div className="flex flex-col bg-[#16181C] rounded-xl mx-4 px-4 p-2 mt-5 space-y-4">
              <h2>Who to Follow</h2>
              <div>Profile 1</div>
              <div>Profile 2</div>
              <div>Profile 3</div>
              <div>Profile 4</div>
            </div>
            <div className="flex flex-col bg-[#16181C] rounded-xl mx-4 px-4 p-2 mt-5 space-y-4">
              <h2>Trending</h2>
              <div>Trend 1</div>
              <div>Trend 2</div>
              <div>Trend 3</div>
              <div>Trend 4</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
