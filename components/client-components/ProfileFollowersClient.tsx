"use client";

import { useRouter } from "next/navigation";

type ProfileFollowersClientProps = {
  followers:
    | {
        followed_id: string;
        follower_id: string;
      }[]
    | null;
  following:
    | {
        followed_id: string;
        follower_id: string;
      }[]
    | null;
  ownProfile: boolean;
  profileUsername: string;
  commonFollowersIds: string[];
  followersText: string;
};

const ProfileFollowersClient = ({
  followers,
  following,
  ownProfile,
  profileUsername,
  commonFollowersIds,
  followersText,
}: ProfileFollowersClientProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row space-x-6">
        <button
          onClick={() => router.push(`${profileUsername}/following`)}
          className="flex flex-row hover:underline transition ease-in-out whitespace-break-spaces"
        >
          <span className="font-semibold">
            {following ? following.length : 0}{" "}
          </span>
          <span className="flex text-gray-500 items-center">Following</span>
        </button>

        <button
          onClick={() => router.push(`${profileUsername}/followers`)}
          className="flex flex-row hover:underline transition ease-in-out whitespace-break-spaces"
        >
          <span className="font-semibold">
            {followers ? followers.length : 0}{" "}
          </span>
          <span className="flex text-gray-500 items-center">Followers</span>
        </button>
      </div>

      {!ownProfile && (
        // on click show list of common followers
        <div
          onClick={() => router.push(`${profileUsername}/followers_you_follow`)}
        >
          {commonFollowersIds.length === 0 ? (
            <h2 className="text-gray-500 text-sm">
              Not follwed by anyone you're following
            </h2>
          ) : (
            <button className="text-gray-500 text-sm hover:underline transition duration-200">
              {followersText}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileFollowersClient;
