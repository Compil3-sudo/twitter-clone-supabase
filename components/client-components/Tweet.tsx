"use client";

import Like from "./Like";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useContext, useEffect, useState } from "react";
import {
  ComposeReplyModalContext,
  ComposeReplyModalContextType,
} from "../context/ComposeReplyModalContext";
import Modal from "./Modal";
import { VscClose } from "react-icons/vsc";

const Tweet = ({
  userId,
  tweet,
  ComposeReply,
}: {
  userId: string;
  // TODO: CHANGE TYPE BACK - FIGURE OUT REPLY
  // tweet: TweetWithAuthor;
  tweet: any;
  ComposeReply: JSX.Element;
}) => {
  const router = useRouter();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const {
    showComposeReplyModal,
    changeReplyModal,
    replyTweet,
    changeReplyTweet,
  } = useContext(ComposeReplyModalContext) as ComposeReplyModalContextType;

  // useEffect(() => {
  //   if (tweet.media_id) {
  //     const downloadMedia = async () => {
  // try {
  //   const supabase = createClientComponentClient();
  //   const path = `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`;

  //   const { data, error } = await supabase.storage
  //     .from("tweets")
  //     .download(path);
  //   if (error) {
  //     throw error;
  //   }

  // if (tweet.media_extension === "mp4") {
  //   setMediaType("video");
  // } else {
  //   setMediaType("image");
  // }

  // const media_url = URL.createObjectURL(data);
  // setMediaUrl(media_url);
  // } catch (error) {
  //   console.log("Error downloading media: ", error);
  // }
  //   const supabase = createClientComponentClient();
  //   const path = `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`;

  //   const { data, error } = await supabase.storage
  //     .from("tweets")
  //     .createSignedUrl(path, 60, {
  //       transform: {
  //         width: 100,
  //         height: 100,
  //       },
  //     });

  //   console.log(data?.signedUrl);

  //   if (tweet.media_extension === "mp4") {
  //     setMediaType("video");
  //   } else {
  //     setMediaType("image");
  //   }

  //   // const media_url = URL.createObjectURL(data);
  //   setMediaUrl(data?.signedUrl || null);
  //   return data?.signedUrl;
  // };

  // const media_url = downloadMedia();
  //   }
  // }, []);

  const navigateToTweet = () => {
    router.push(`/${tweet.author.username}/tweet/${tweet.id}`);
  };

  // should I use nextJs Link component instead ?
  const navigateToUserProfile = (event: React.MouseEvent) => {
    // without this it would redirect to the Tweet view page
    event.stopPropagation(); // Prevent the click event from propagating to the parent div
    router.push(`/${tweet.author.username}`);
  };

  const stopNavigationPropagation = (event: React.MouseEvent) => {
    // without this it would redirect to the Tweet view page
    event.stopPropagation(); // Prevent the click event from propagating to the parent div
  };

  const openReplyModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    const helper = {
      author: {
        username: tweet.author.username,
      },
      id: tweet.id,
    };
    changeReplyTweet(helper);
    changeReplyModal(true);
  };

  return (
    <>
      {showComposeReplyModal && tweet.id === replyTweet?.id && (
        <Modal onClose={() => changeReplyModal(false)}>
          <div className="flex flex-col bg-slate-950 rounded-3xl px-2 py-4 sm:w-[600px] w-[300px]">
            <div
              onClick={() => changeReplyModal(false)}
              className="p-1 mx-4 rounded-full w-fit cursor-pointer text-gray-300 hover:bg-gray-500"
            >
              <VscClose size={25} />
            </div>
            {ComposeReply}
          </div>
        </Modal>
      )}
      <div
        onClick={navigateToTweet}
        className="flex w-full py-2 px-4 space-x-3 border-b cursor-pointer"
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

        <div className="flex flex-col w-full space-y-3">
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
          {tweet.media_id && (
            <div className="">
              {tweet.mediaUrl && (
                <>
                  {
                    // mediaType === "image" ? (
                    tweet.media_extension !== "mp4" ? (
                      <Image
                        width={140}
                        height={140}
                        src={tweet.mediaUrl}
                        alt="Media"
                        className="rounded-xl"
                      />
                    ) : // mediaType === "video" ? (
                    tweet.media_extension === "mp4" ? (
                      <video controls>
                        <source
                          src={tweet.mediaUrl}
                          type={`video/${tweet.media_extension}`}
                        />
                      </video>
                    ) : null
                  }
                </>
              )}
            </div>
          )}
          {/* Tweet content */}

          {/* Tweet Footer */}
          <footer>
            <div className="flex text-gray-500 justify-between">
              <div
                onClick={openReplyModal}
                className="group flex items-center hover:text-blue-500 transition duration-200"
              >
                <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                  <BiMessageRounded size={20} />
                </div>
                <div className="text-sm px-1 justify-center">
                  {tweet.replies}
                </div>
              </div>

              <div
                onClick={stopNavigationPropagation}
                className="group flex items-center hover:text-green-500 transition duration-200"
              >
                <div className="group-hover:bg-green-500/10 p-2 rounded-full">
                  <BiRepost size={20} />
                </div>
                <div className="text-sm px-1 justify-center">0</div>
              </div>

              <div onClick={stopNavigationPropagation}>
                <Like userId={userId} tweet={tweet} />
              </div>

              <div
                onClick={stopNavigationPropagation}
                className="group flex items-center hover:text-blue-500 transition duration-200"
              >
                <div className="group-hover:bg-blue-500/10 p-2 rounded-full">
                  <IoIosStats size={20} />
                </div>
                <div className="text-sm px-1 justify-center">0</div>
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
