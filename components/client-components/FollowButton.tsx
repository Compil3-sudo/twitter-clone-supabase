"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const FollowButton = ({
  userProfileId,
  currentUserId,
  isUserFollowingProfile,
}: any) => {
  const supabase = createClientComponentClient();
  const [followStatus, setFollowStatus] = useState(isUserFollowingProfile);
  const [isHovering, setIsHovering] = useState(false);

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
      const { data, error } = await supabase.from("followers").delete().match({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });
      console.log(data);
      console.log(error);
    } else {
      // the currentUser wants to follow the userProfile
      setFollowStatus(true);
      const { data, error } = await supabase.from("followers").insert({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });
      console.log(data);
      console.log(error);
    }
  };

  // Follow(bg-white & hover-lighter)/Following (bg-black & hover-red - unfollow)
  return (
    <button
      onClick={toggleFollow}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-full font-medium px-4 py-1 border border-transparent ${
        followStatus
          ? "text-white w-[106px] bg-transparent border border-gray-600 hover:border-red-700 hover:bg-red-800/30 hover:text-red-600 transition duration-200"
          : "text-black bg-[#EFF3F4]"
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
