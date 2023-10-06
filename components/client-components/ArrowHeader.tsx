"use client";

import { VscArrowLeft } from "react-icons/vsc";

const ArrowHeader = ({
  title,
  numberOfPosts,
}: {
  title: string;
  numberOfPosts?: number;
}) => {
  function scrollToTop(): void {
    window.scrollTo({
      top: 0,
    });
  }

  function navigateBack() {
    window.history.back();
  }

  return (
    <div
      onClick={scrollToTop}
      className="z-10 top-0 sticky flex min-h-[57px] cursor-pointer border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950"
    >
      <div
        onClick={navigateBack}
        className="p-2 hover:bg-white/10 rounded-full my-auto mx-2 cursor-pointer"
      >
        <VscArrowLeft size={20} />
      </div>

      {numberOfPosts ? (
        <div className="flex flex-col px-6 py-1 font-medium">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-500 text-sm">
            {numberOfPosts} {numberOfPosts === 1 ? "post" : "posts"}
          </p>
        </div>
      ) : (
        <h2 className="flex items-center px-6 text-xl font-semibold">
          {title}
        </h2>
      )}
    </div>
  );
};

export default ArrowHeader;
