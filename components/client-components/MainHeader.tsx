"use client";

import { useContext } from "react";
import {
  InfiniteFeedContext,
  InfiniteFeedContextType,
  InfiniteScrollFeedOption,
} from "../context/InfiniteFeedContext";

const MainHeader = () => {
  const { activeFeed, changeFeed } = useContext(
    InfiniteFeedContext
  ) as InfiniteFeedContextType;

  const changeActiveFeed = (tab: (typeof InfiniteScrollFeedOption)[number]) => {
    changeFeed(tab);
  };

  return (
    <div className="top-0 sticky z-10 flex border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950">
      <div className="flex flex-col w-full">
        <h1 className="text-lg p-4 font-bold">Home</h1>
        <div className="flex flex-row">
          <button
            onClick={() => changeActiveFeed(InfiniteScrollFeedOption[0])}
            className="w-1/2 flex justify-center hover:bg-white/10"
          >
            <div
              className={`self-center ${
                activeFeed === InfiniteScrollFeedOption[0]
                  ? "border-blue-500 border-b-4 py-4 font-semibold"
                  : "text-gray-500 border-b-4 border-transparent"
              }`}
            >
              For You
            </div>
          </button>
          <button
            onClick={() => changeActiveFeed(InfiniteScrollFeedOption[1])}
            className="w-1/2 flex justify-center hover:bg-white/10"
          >
            <div
              className={`self-center ${
                activeFeed === InfiniteScrollFeedOption[1]
                  ? "border-blue-500 border-b-4 py-4 font-semibold"
                  : "text-gray-500 border-b-4 border-transparent"
              }`}
            >
              Following
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
