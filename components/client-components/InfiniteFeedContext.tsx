"use client";

import { createContext, useState } from "react";

export const InfiniteFeedTabs = ["For You", "Following"] as const;

export type InfiniteFeedContextType = {
  activeFeed: (typeof InfiniteFeedTabs)[number];
  changeFeed: (tab: (typeof InfiniteFeedTabs)[number]) => void;
};

export const InfiniteFeedContext =
  createContext<InfiniteFeedContextType | null>(null);

const InfiniteFeedProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeFeed, setActiveFeed] = useState<
    (typeof InfiniteFeedTabs)[number]
  >(InfiniteFeedTabs[0]);

  const changeFeed = (tab: (typeof InfiniteFeedTabs)[number]) => {
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
