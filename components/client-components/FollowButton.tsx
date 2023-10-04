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

  const toggleFollow = async () => {
    if (followStatus) {
      // the currentUser wants to UN-follow the userProfile
      setFollowStatus(false);
      await supabase.from("followers").delete().match({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });
    } else {
      // the currentUser wants to follow the userProfile
      setFollowStatus(true);
      await supabase.from("followers").insert({
        follower_id: currentUserId,
        followed_id: userProfileId,
      });
    }
  };

  // Follow(bg-white & hover-lighter)/Following (bg-black & hover-red - unfollow)
  return (
    <button
      onClick={toggleFollow}
      className="rounded-full text-black font-medium bg-[#EFF3F4] px-4 py-1"
    >
      {followStatus ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
