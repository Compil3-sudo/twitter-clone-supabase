import ArrowHeader, {
  FollowersTabs,
} from "@/components/client-components/ArrowHeader";
import SuggestedProfile from "@/components/client-components/SuggestedProfile";
import getAllUsers from "@/lib/getAllUsers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface UserProfileFollowing extends Profile {
  isUserFollowingProfile?: boolean;
}

const ProfileFollowing = async ({
  params,
}: {
  params: { username: string };
}) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user: currentUser },
    error: userError,
  } = await supabase.auth.getUser();

  // user must be logged in to see profile pages
  if (!currentUser) redirect("/");

  const { data: currentUserProfile, error: currentUserProfileError } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

  if (!currentUserProfile) redirect("/");

  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error) console.log(error);
  if (!userProfile) redirect(`/${params.username}`);

  const { data: following, error: followingIdsError } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", userProfile.id);

  const ownProfile = currentUserProfile.username === userProfile.username;

  let userProfileFollowing: UserProfileFollowing[] = [];
  let commonFollowersIds = [] as Profile["id"][];

  // who is the current user following
  const { data: userFollowing, error: userFollowingError } = await supabase
    .from("followers")
    .select("followed_id")
    .eq("follower_id", currentUserProfile.id);

  // determine whether the userProfile is being followed
  // by people who the current user is also following
  const userProfileFollowingIds =
    following
      ?.filter((follower) => follower.followed_id !== currentUserProfile.id)
      .map((follower) => follower.followed_id) || [];

  const userFollowingIds =
    userFollowing?.map((following) => following.followed_id) || [];

  // find common followers
  commonFollowersIds = userProfileFollowingIds.filter((followerId) =>
    userFollowingIds.includes(followerId)
  );

  const { data: followersData, error: followersError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userProfileFollowingIds);

  if (followersData) userProfileFollowing = followersData;

  userProfileFollowing = userProfileFollowing.map((profile) => ({
    ...profile,
    isUserFollowingProfile: commonFollowersIds.includes(profile.id),
  }));

  return (
    <>
      <ArrowHeader
        title={userProfile.name}
        subtitle={userProfile.username}
        ownProfile={ownProfile}
        followersTabs={true}
        followersActiveTab={"Following"}
        // followersActiveTab={FollowersTabs[3]}
      />
      {following && following.length === 0 ? (
        <div className="p-2">
          <h1 className="text-xl font-semibold">
            @{userProfile.username} isn't following anyone yet
          </h1>
          <h2 className="text-gray-500 text-sm">
            When they start following someone, they'll be listed here.
          </h2>
        </div>
      ) : (
        userProfileFollowing.map((profile) => (
          <SuggestedProfile
            key={profile.id}
            userId={currentUserProfile.id}
            suggestedProfile={profile}
            isUserFollowingProfile={profile.isUserFollowingProfile}
            showBio={true}
          />
        ))
      )}
    </>
  );
};

export default ProfileFollowing;

export async function generateStaticParams() {
  // generate all profile pages with SSG
  const allUsers = await getAllUsers();

  return allUsers.map((user) => ({
    username: user.username,
  }));
}
