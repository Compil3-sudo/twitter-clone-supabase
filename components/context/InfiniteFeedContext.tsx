"use client";

import { createContext, useState } from "react";

export const InfiniteScrollFeedOption = [
  "For You",
  "Following",
  "Profile",
] as const;

export type InfiniteFeedContextType = {
  activeFeed: (typeof InfiniteScrollFeedOption)[number];
  changeFeed: (tab: (typeof InfiniteScrollFeedOption)[number]) => void;
};

export const InfiniteFeedContext =
  createContext<InfiniteFeedContextType | null>(null);

const InfiniteFeedProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFeed, setActiveFeed] = useState<
    (typeof InfiniteScrollFeedOption)[number]
  >(InfiniteScrollFeedOption[0]);

  const changeFeed = (tab: (typeof InfiniteScrollFeedOption)[number]) => {
    setActiveFeed(tab);
  };

  return (
    <InfiniteFeedContext.Provider
      value={{
        activeFeed,
        changeFeed,
      }}
    >
      {children}
    </InfiniteFeedContext.Provider>
  );
};

export default InfiniteFeedProvider;
