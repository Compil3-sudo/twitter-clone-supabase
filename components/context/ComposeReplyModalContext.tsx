"use client";

import { createContext, useState } from "react";

export type replyTweetType = {
  id: TweetWithAuthor["id"];
  author: {
    username: TweetWithAuthor["author"]["username"];
  };
};

export type ComposeReplyModalContextType = {
  showComposeReplyModal: boolean;
  changeReplyModal: (status: boolean) => void;
  replyTweet: replyTweetType | null;
  changeReplyTweet: (tweet: replyTweetType) => void;
};

export const ComposeReplyModalContext =
  createContext<ComposeReplyModalContextType | null>(null);

const ComposeReplyModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showComposeReplyModal, setShowComposeReplyModal] = useState(false);
  const [replyTweet, setReplyTweet] = useState<replyTweetType | null>(null);

  const changeReplyModal = (status: boolean) => {
    setShowComposeReplyModal(status);
  };

  const changeReplyTweet = (tweet: replyTweetType) => {
    setReplyTweet(tweet);
  };

  return (
    <ComposeReplyModalContext.Provider
      value={{
        showComposeReplyModal,
        changeReplyModal,
        replyTweet,
        changeReplyTweet,
      }}
    >
      {children}
    </ComposeReplyModalContext.Provider>
  );
};

export default ComposeReplyModalProvider;
