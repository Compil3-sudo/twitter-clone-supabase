"use client";

import Like from "./Like";
import ComposeReply from "./ComposeReply";
import Link from "next/link";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { useRouter } from "next/navigation";

const Tweet = ({ user, tweet }: any) => {
  const router = useRouter();

  // IMPORTANT FIX: make user be a userprofile => user.username not metadata
  const navigateToTweet = () => {
    router.push(`${user.user_metadata.user_name}/tweet/${tweet.id}`);
  };

  // should I use nextJs Link component instead ?
  const navigateToUserProfile = (event: React.MouseEvent) => {
    // without this it would redirect to the Tweet view page
    event.stopPropagation(); // Prevent the click event from propagating to the parent div
    router.push(`${tweet.author.username}`);
  };

  const stopNavigationPropagation = (event: React.MouseEvent) => {
    // without this it would redirect to the Tweet view page
    event.stopPropagation(); // Prevent the click event from propagating to the parent div
  };

  //  <ComposeReply user={user} tweet={tweet} />;

  return (
    <>
      <div
        onClick={navigateToTweet}
        className="flex w-full py-2 px-4 space-x-2 border-b cursor-pointer"
      >
        {/* Tweet Author Profile Image */}
        <div className="flex-none pt-2">
          <Image
            src={tweet.author.avatar_url}
            width={40}
            height={40}
            className="rounded-full"
            alt="Profile Image"
            onClick={navigateToUserProfile}
          />
        </div>
        {/* Tweet Author Profile Image */}

        <div className="flex flex-col w-full space-y-2">
          {/* Tweet header - author - name @username * created_x time ago */}
          <header className="flex flex-row space-x-4 justify-center items-center">
            <div
              className="hover:underline transition duration-200"
              onClick={navigateToUserProfile}
            >
              {tweet.author.name}
            </div>

            <div className="text-gray-500" onClick={navigateToUserProfile}>
              @{tweet.author.username}
            </div>

            <div className="text-gray-500"> - </div>
            <div className="text-gray-500 hover:underline transition duration-200">
              {tweet.created_at.slice(0, 10)}
            </div>
            <div className="flex flex-col flex-grow">
              <div
                onClick={stopNavigationPropagation}
                className="self-end rounded-full p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10"
              >
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
              <div
                onClick={stopNavigationPropagation}
                className="group flex items-center hover:text-blue-500 transition duration-200"
              >
                <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                  <BiMessageRounded size={20} />
                </div>
                <div className="text-sm px-1 justify-center">120</div>
              </div>

              <div
                onClick={stopNavigationPropagation}
                className="group flex items-center hover:text-green-500 transition duration-200"
              >
                <div className="group-hover:bg-green-500/10 p-2 rounded-full">
                  <BiRepost size={20} />
                </div>
                <div className="text-sm px-1 justify-center">272</div>
              </div>

              <div onClick={stopNavigationPropagation}>
                <Like user={user} tweet={tweet} />
              </div>

              <div
                onClick={stopNavigationPropagation}
                className="group flex items-center hover:text-blue-500 transition duration-200"
              >
                <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                  <IoIosStats size={20} />
                </div>
                <div className="text-sm px-1 justify-center">247.4K</div>
              </div>

              <div
                onClick={stopNavigationPropagation}
                className="flex items-center hover:text-blue-500 transition duration-200 hover:bg-blue-500/10 p-2 rounded-full"
              >
                <FiShare size={20} />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Tweet;
