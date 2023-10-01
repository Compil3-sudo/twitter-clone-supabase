import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ComposeTweet from "@/components/client-components/ComposeTweet";
import Tweet from "@/components/client-components/Tweet";
import MainHeader from "@/components/client-components/MainHeader";

const InfiniteFeed = ({ user, tweets }: any) => {
  return (
    <main className="flex flex-col max-w-[600px] w-full h-full min-h-screen mx-2 border-l border-r">
      <MainHeader />
      <ComposeTweet user={user} />
      {/* TWEETS FEED */}
      <div className="flex flex-col items-center">
        {tweets.map((tweet: any) => (
          // <Tweet key={tweet.id} user={user} tweet={tweet} />
          <div className="flex w-full py-2 px-4 space-x-2 border-b">
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

            <div className="flex flex-col w-full space-y-2">
              {/* Tweet header - author - name @username * created_x time ago */}
              <header className="flex flex-row space-x-4 justify-center items-center">
                <div>{tweet.author.name}</div>
                <div className="text-gray-500">@{tweet.author.username}</div>
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
              <div className="">{tweet.text}</div>
              {/* add tweet media - image / video ? later */}
              {/* <div className="bg-gray-600 rounded-2xl h-20 py-2">Media</div> */}
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
                    <div className="text-sm px-1 justify-center">
                      {tweet.likes}
                    </div>
                  </div>
                  <div className="group flex items-center hover:text-blue-500 transition duration-200">
                    <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                      <IoIosStats size={20} />
                    </div>
                    <div className="text-sm px-1 justify-center">247.4K</div>
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
  );
};

export default InfiniteFeed;
