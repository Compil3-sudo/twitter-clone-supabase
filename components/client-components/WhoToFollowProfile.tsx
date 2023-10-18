"use client";

import Image from "next/image";
import FollowButton from "./FollowButton";
import { useRouter } from "next/navigation";

type WhoToFollowProfileProps = {
  userId: string;
  followProfile: {
    id: Profile["id"];
    username: Profile["username"];
    name: Profile["name"];
    avatar_url: Profile["avatar_url"];
    bio?: Profile["bio"];
  };
  isUserFollowingProfile?: boolean;
  showBio?: boolean;
};

const WhoToFollowProfile = ({
  userId,
  followProfile,
  isUserFollowingProfile = false,
  showBio = false,
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
      <div
        className={`flex-none overflow-hidden w-10 h-10 ${
          showBio ? "" : "my-auto"
        }`}
      >
        <div className="w-full h-full relative">
          <Image
            src={followProfile.avatar_url}
            fill
            className="rounded-full object-cover"
            alt="Profile Image"
          />
        </div>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <div className="flex w-full">
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
                  isUserFollowingProfile={isUserFollowingProfile}
                />
              </div>
            </div>
          </div>
          {showBio && <span>{followProfile.bio}</span>}
        </div>
      </div>
    </div>
  );
};

export default WhoToFollowProfile;
