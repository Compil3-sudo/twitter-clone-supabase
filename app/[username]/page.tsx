import FollowButton from "@/components/client-components/FollowButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { useParams } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const supabase = createServerComponentClient({ cookies });

  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error) {
    console.log(error);
  }

  if (!userProfile) {
    return (
      <>
        <div>back arrow profile</div>
        <div>Profile Image</div>
        <h1>@{params.username}</h1>
        <div className="container px-16 mx-auto">
          <h2>This account doesn't exist</h2>
          <h3>Try searching for another.</h3>
        </div>
      </>
    );
  }

  const {
    data: { user: currentUser },
    error: userError,
  } = await supabase.auth.getUser();

  const { data: following, error: followingError } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", userProfile.id);

  const { data: followers, error: followersError } = await supabase
    .from("followers")
    .select("*")
    .eq("followed_id", userProfile.id);

  const ownProfile =
    currentUser?.user_metadata.user_name === userProfile.username;

  let isUserFollowingProfile;

  if (!ownProfile) {
    // who is the current user following
    const { data: userFollowing, error: userFollowingError } = await supabase
      .from("followers")
      .select("*")
      .eq("follower_id", currentUser?.id);

    // the !! transforms it from object/undefined to true/false
    isUserFollowingProfile = !!userFollowing?.find(
      (followedId) => followedId.followed_id === userProfile.id
    );
  }

  const { data: userTweets } = await supabase
    .from("tweets")
    .select("*")
    .eq("user_id", userProfile.id);

  return (
    <>
      <div>ProfilePage of {userProfile.username}</div>
      <pre>{JSON.stringify(userProfile, null, 2)}</pre>
      {/* {currentUser?.user_metadata.user_name !== userProfile.username ? ( */}
      {!ownProfile ? (
        <div>
          <FollowButton
            isUserFollowingProfile={isUserFollowingProfile}
            userProfileId={userProfile.id}
            currentUserId={currentUser?.id}
          />
        </div>
      ) : null}
      <div>
        <p>Joined {userProfile.created_at}</p>
      </div>
      <div className="flex flex-row space-x-4">
        <h2>{following ? following.length : 0} Following</h2>
        <h2>{followers ? followers.length : 0} Followers</h2>
      </div>
      <div>
        <h2>Not follwed by anyone you're following</h2>
        <h2>Followed by ... and x others you follow</h2>
      </div>
      <h1>Tweets of {userProfile.username}</h1>
      <pre>{JSON.stringify(userTweets, null, 2)}</pre>
    </>
  );
};

export default ProfilePage;

// export async function generateStaticParams() {
//   const supabase = createServerComponentClient({ cookies });
// const params = useParams();
// console.log(params);

// get user posts here ?

// const tweets = await supabase.from("tweets").select("*").eq("user_id");

// return posts.map((post) => ({
//   slug: post.slug,
// }));
// }
