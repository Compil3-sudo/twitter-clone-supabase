"use client";

import React from "react";
import Like from "./Like";
import ComposeReply from "./ComposeReply";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Tweet = ({ user, tweet }: any) => {
  const path = usePathname();
  return (
    <>
      <div className="p-10 flex flex-col w-full items-center">
        <Link href={`${tweet.author.username}`}>
          <p className="py-2">Author: {tweet.author.username}</p>
        </Link>
        <p>Tweet: {tweet.text}</p>
        <p>Likes Count: {tweet.likes}</p>
        <p>Liked by Author: {tweet.author_has_liked ? "true" : "false"}</p>
        <div className="self-start">
          <Like user={user} tweet={tweet} />
        </div>

        {/* remove this when path is already on tweet */}
        {path === "/" && (
          <div className="self-start">
            <Link href={`${tweet.author.username}/tweet/${tweet.id}`}>
              GO TO TWEET
            </Link>
          </div>
        )}
        <div className="self-start">
          <ComposeReply user={user} tweet={tweet} />
        </div>
      </div>
    </>
  );
};

export default Tweet;
