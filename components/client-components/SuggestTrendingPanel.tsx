"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";

const SuggestTrendingPanel = () => {
  const path = usePathname();
  let marginTop = "mt-5";

  if (path.startsWith("/connect")) {
    marginTop = "mt-16";
  }

  return (
    <div
      className={`flex flex-col bg-[#16181C] rounded-xl pt-2 ${marginTop} mb-20`}
    >
      <h2 className="p-2 text-lg font-bold">Trending</h2>
      {Array(20)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200"
          >
            <div className="flex w-full justify-between">
              <div className="flex flex-col w-full">
                <h2 className="">Trend #{index}</h2>
              </div>
              <div className="flex flex-col w-fit justify-center items-end">
                <div className="self-end rounded-full p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                  <BsThreeDots />
                </div>
              </div>
            </div>
          </div>
        ))}
      <Link
        href={"/"}
        className="rounded-b-xl text-sky-500 hover:bg-white/10 transition duration-200 px-2 py-4"
      >
        Show more
      </Link>
    </div>
  );
};

export default SuggestTrendingPanel;
