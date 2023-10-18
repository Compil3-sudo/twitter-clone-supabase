"use client";

import { useRouter } from "next/navigation";
import { VscArrowLeft } from "react-icons/vsc";

const ArrowHeader = ({
  title,
  subtitle,
  followersTabs,
  numberOfPosts,
}: {
  title: string;
  subtitle?: string;
  followersTabs?: boolean;
  numberOfPosts?: number;
}) => {
  const router = useRouter();

  function scrollToTop(): void {
    window.scrollTo({
      top: 0,
    });
  }

  function navigateBack() {
    router.back();
  }

  if (subtitle && followersTabs) {
    return (
      <div className="z-10 top-0 sticky flex min-h-[57px] cursor-pointer border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950">
        <div className="flex flex-col w-full">
          <div onClick={scrollToTop} className="flex">
            <div
              onClick={navigateBack}
              className="p-2 hover:bg-white/10 rounded-full my-auto mx-2 cursor-pointer"
            >
              <VscArrowLeft size={20} />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col px-6 py-1 font-medium">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className="text-gray-500 text-sm">@{subtitle}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full">
            <button
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/${subtitle}/followers_you_follow`);
              }}
              className="w-1/3 flex justify-center hover:bg-white/10"
            >
              <div className="self-center border-blue-500 border-b-4 py-4 font-semibold">
                Followers you know
              </div>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/${subtitle}/followers`);
              }}
              className="w-1/3 flex justify-center hover:bg-white/10"
            >
              <div className="self-center text-gray-500 border-b-4 border-transparent">
                Followers
              </div>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/${subtitle}/following`);
              }}
              className="w-1/3 flex justify-center hover:bg-white/10"
            >
              <div className="self-center text-gray-500 border-b-4 border-transparent">
                Following
              </div>
            </button>
          </div>
        </div>
      </div>
    );
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
