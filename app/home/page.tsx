import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ComposeTweet from "@/components/client-components/ComposeTweet";

import { redirect } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";

// Infinite Tweets Feed - move to component later
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Tweet from "@/components/client-components/Tweet";
// Infinite Tweets Feed - move to component later

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
        <main className="flex flex-col max-w-[600px] w-full h-full min-h-screen mx-2 border-l border-r">
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
            {tweets?.map((tweet) => (
              // <Tweet key={tweet.id} user={user} tweet={tweet} />
              <div className="flex py-2 px-4 space-x-2 border-b">
                {/* Tweet Author Profile Image */}
                <div className="flex-none pt-2">
                  <Image
                    src={tweet.author.avatar_url}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="Profile Image"
                  />
                </div>
                {/* Tweet Author Profile Image */}

                <div className="flex flex-col space-y-2">
                  {/* Tweet header - author - name @username * created_x time ago */}
                  <header className="flex flex-row space-x-4 justify-center items-center">
                    <div>{tweet.author.name}</div>
                    <div className="text-gray-500">
                      @{tweet.author.username}
                    </div>
                    <div className="text-gray-500"> * </div>
                    <div className="text-gray-500">
                      {tweet.created_at.slice(0, 10)}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="self-end rounded-full p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                        <BsThreeDots />
                      </div>
                    </div>
                  </header>
                  {/* Tweet header - author - name @username * created_x time ago */}

                  {/* Tweet content */}
                  <div className="">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Omnis alias quia obcaecati vero maiores nulla ut, soluta
                    excepturi molestiae distinctio quos recusandae, laudantium
                    rem pariatur minus suscipit totam aliquid. Odit
                    consequuntur, corporis assumenda dolores nisi reiciendis ab,
                    blanditiis maxime optio fugiat, officiis nostrum totam
                    deserunt soluta et exercitationem aut. Enim?
                  </div>
                  <div className="bg-gray-600 rounded-2xl h-20 py-2">Media</div>
                  {/* Tweet content */}

                  {/* Tweet Footer */}
                  <footer>
                    <div className="flex text-gray-500 justify-between">
                      <div className="group flex items-center hover:text-blue-500 transition duration-200">
                        <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                          <BiMessageRounded size={20} />
                        </div>
                        <div className="text-sm px-1 justify-center">120</div>
                      </div>

                      <div className="group flex items-center hover:text-green-500 transition duration-200">
                        <div className="group-hover:bg-green-500/10 p-2 rounded-full">
                          <BiRepost size={20} />
                        </div>
                        <div className="text-sm px-1 justify-center">272</div>
                      </div>

                      <div className="group flex items-center hover:text-red-500 transition duration-200">
                        <div className="group-hover:bg-red-500/10 p-2 rounded-full">
                          <AiOutlineHeart size={20} />
                          {/* <AiHeartFill /> */}
                        </div>
                        <div className="text-sm px-1 justify-center">2,799</div>
                      </div>
                      <div className="group flex items-center hover:text-blue-500 transition duration-200">
                        <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                          <IoIosStats size={20} />
                        </div>
                        <div className="text-sm px-1 justify-center">
                          247.4K
                        </div>
                      </div>
                      <div className="flex items-center hover:text-blue-500 transition duration-200 hover:bg-blue-500/10 p-2 rounded-full">
                        <FiShare size={20} />
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            ))}
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
