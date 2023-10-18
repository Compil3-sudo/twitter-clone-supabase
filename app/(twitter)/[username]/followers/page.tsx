import ArrowHeader, {
  FollowersTabs,
} from "@/components/client-components/ArrowHeader";
import WhoToFollowProfile from "@/components/client-components/WhoToFollowProfile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface UserProfileFollowers extends Profile {
  isUserFollowingProfile?: boolean;
}

const ProfileFollowers = async ({
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

  const { data: followers, error: followersError } = await supabase
    .from("followers")
    .select("*")
    .eq("followed_id", userProfile.id);

  const ownProfile = currentUserProfile.username === userProfile.username;

  let userProfileFollowers: UserProfileFollowers[] = [];
  let commonFollowersIds = [] as Profile["id"][];

  if (!ownProfile) {
    // who is the current user following
    const { data: userFollowing, error: userFollowingError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", currentUserProfile.id);

    // determine whether the userProfile is being followed
    // by people who the current user is also following
    const userProfileFollowersIds =
      followers
        ?.filter((follower) => follower.follower_id !== currentUserProfile.id)
        .map((follower) => follower.follower_id) || [];

    const userFollowingIds =
      userFollowing?.map((following) => following.followed_id) || [];

    // find common followers
    commonFollowersIds = userProfileFollowersIds.filter((followerId) =>
      userFollowingIds.includes(followerId)
    );

    console.log(commonFollowersIds);

    const { data: followersData, error: followersError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userProfileFollowersIds);

    if (followersData) userProfileFollowers = followersData;

    userProfileFollowers = userProfileFollowers.map((profile) => ({
      ...profile,
      isUserFollowingProfile: commonFollowersIds.includes(profile.id),
    }));
  }

  return (
    <>
      <ArrowHeader
        title={userProfile.name}
        subtitle={userProfile.username}
        ownProfile={ownProfile}
        followersTabs={true}
        followersActiveTab={"Followers"}
        // followersActiveTab={FollowersTabs[2]}
      />
      {followers && followers.length === 0 ? (
        <>
          <div>
            <h1>@{userProfile.username} doesn't have any followers yet</h1>
            <h2>When someone follows them, they'll be listed here.</h2>
          </div>
        </>
      ) : (
        userProfileFollowers.map((profile) => (
          <WhoToFollowProfile
            userId={currentUserProfile.id}
            followProfile={profile}
            isUserFollowingProfile={profile.isUserFollowingProfile}
            showBio={true}
          />
        ))
      )}
    </>
  );
};

export default ProfileFollowers;
