"use client";

import React from "react";
import Like from "./Like";
import ComposeReply from "./ComposeReply";
import Link from "next/link";

const Tweet = ({ user, tweet }: any) => {
  return (
    <>
      <div className="p-10 flex flex-col">
        <p>Author: {tweet.author.username}</p>
        <p>Tweet: {tweet.text}</p>
        <p>Likes Count: {tweet.likes}</p>
        <p>Liked by Author: {tweet.author_has_liked ? "true" : "false"}</p>
        <div className="self-start">
          <Like user={user} tweet={tweet} />
        </div>

        {/* remove this when path is already on tweet */}
        <div className="self-start">
          <Link href="/tweet">GO TO TWEET</Link>
        </div>
        <div className="self-start">
          <ComposeReply user={user} tweet={tweet} />
        </div>
      </div>
    </>
  );
};

export default Tweet;
