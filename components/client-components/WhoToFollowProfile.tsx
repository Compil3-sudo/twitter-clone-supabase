"use client";

import Image from "next/image";
import FollowButton from "./FollowButton";
import { useRouter } from "next/navigation";

type WhoToFollowProfileProps = {
  userId: string;
  followProfile: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
  };
};

const WhoToFollowProfile = ({
  userId,
  followProfile,
}: WhoToFollowProfileProps) => {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push(`/${followProfile.username}`);
  };

  return (
    <div
      onClick={navigateToProfile}
      className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200 cursor-pointer"
    >
      <div className="flex-none my-auto">
        <Image
          src={followProfile.avatar_url}
          width={40}
          height={40}
          alt="Profile Image"
          className="rounded-full"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <h2 className="hover:underline transition duration-200">
            {followProfile.name}
          </h2>
          <h2 className="text-gray-500">@{followProfile.username}</h2>
        </div>
        <div className="flex flex-col w-fit justify-center items-end">
          {/* do NOT navigate to profile when clicking on follow/unfollow */}
          <div onClick={(event) => event.stopPropagation()}>
            <FollowButton
              userProfileId={followProfile.id}
              currentUserId={userId}
              isUserFollowingProfile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoToFollowProfile;
