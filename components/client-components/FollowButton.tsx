"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FollowButton = ({
  userProfileId,
  currentUserId,
  isUserFollowingProfile,
}: {
  userProfileId: string;
  currentUserId: string;
  isUserFollowingProfile: boolean;
}) => {
  const supabase = createClientComponentClient<Database>();
  const [followStatus, setFollowStatus] = useState(isUserFollowingProfile);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const toggleFollow = async () => {
    if (followStatus) {
      // the currentUser wants to UN-follow the userProfile
      setFollowStatus(false);
      const { error } = await supabase.from("followers").delete().match({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });

      if (error) {
        console.log(error);
      } else {
        router.refresh();
      }
    } else {
      // the currentUser wants to follow the userProfile
      setFollowStatus(true);
      const { error } = await supabase.from("followers").insert({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });

      if (error) {
        console.log(error);
      } else {
        router.refresh();
      }
    }
  };

  // Follow(bg-white & hover-lighter)/Following (bg-black & hover-red - unfollow)
  return (
    <button
      onClick={toggleFollow}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-full font-medium px-4 py-1 border ${
        followStatus
          ? "text-white w-[106px] bg-transparent border border-slate-600 hover:border-red-700 hover:bg-red-800/30 hover:text-red-600 transition duration-200"
          : "text-black border-transparent bg-[#EFF3F4] hover:bg-opacity-80 transition duration-200"
      }`}
    >
      {followStatus && !isHovering
        ? "Following"
        : followStatus
        ? "Unfollow"
        : "Follow"}
    </button>
  );
};

export default FollowButton;
