"use client";

import Image from "next/image";
import FollowButton from "./FollowButton";
import { useRouter } from "next/navigation";

type SuggestedProfileProps = {
  userId: string;
  suggestedProfile: {
    id: Profile["id"];
    username: Profile["username"];
    name: Profile["name"];
    avatar_url: Profile["avatar_url"];
    bio?: Profile["bio"];
  };
  isUserFollowingProfile?: boolean;
  showBio?: boolean;
  onClickFunction?: () => void;
  icon?: JSX.Element;
};

const SuggestedProfile = ({
  userId,
  suggestedProfile,
  isUserFollowingProfile,
  showBio = false,
  onClickFunction,
  icon,
}: SuggestedProfileProps) => {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push(`/${suggestedProfile.username}`);
  };

  return (
    <div
      // onClick navigateToProfile OR create conversation OR go to conversation
      onClick={onClickFunction ? onClickFunction : navigateToProfile}
      className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200 cursor-pointer"
    >
      <div
        className={`flex-none overflow-hidden w-10 h-10 ${
          showBio ? "" : "my-auto"
        }`}
      >
        <div className="w-full h-full relative">
          <Image
            src={suggestedProfile.avatar_url}
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
              <h2
                className={`${
                  isUserFollowingProfile !== undefined &&
                  "hover:underline transition duration-200"
                }`}
              >
                {suggestedProfile.name}
              </h2>
              <h2 className="text-gray-500 text-sm">
                @{suggestedProfile.username}
              </h2>
            </div>
            <div className="flex flex-col w-fit justify-center items-end">
              {/* do NOT navigate to profile when clicking on follow/unfollow */}
              {isUserFollowingProfile === undefined ? (
                <>{icon}</>
              ) : (
                <div onClick={(event) => event.stopPropagation()}>
                  <FollowButton
                    userProfileId={suggestedProfile.id}
                    currentUserId={userId}
                    isUserFollowingProfile={isUserFollowingProfile}
                  />
                </div>
              )}
            </div>
          </div>
          {showBio && <span>{suggestedProfile.bio}</span>}
        </div>
      </div>
    </div>
  );
};

export default SuggestedProfile;
