import FollowButton from "@/components/client-components/FollowButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { VscArrowLeft } from "react-icons/vsc";
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
  let commonFollowers = [];

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

    // determine whether the userProfile is being followed
    // by people who the current user is also following
    const userProfileFollowers =
      followers?.map((follower) => follower.follower_id) || [];
    const userFollowingIds =
      userFollowing?.map((following) => following.followed_id) || [];

    // find common followers
    commonFollowers = userProfileFollowers.filter((followerId) =>
      userFollowingIds.includes(followerId)
    );

    // make text - 1 commonFollower:
    // followed by user
    // 2: followed by userA and userB
    // 3: followed by user1, user2 and user3
    // >3: followed by userA, userB and commonFollowers.length other you follow
  }

  const { data: userTweets } = await supabase
    .from("tweets")
    .select("*")
    .eq("user_id", userProfile.id);

  const numberOfPosts = userTweets?.length;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* PROFILE HEADER */}
        {/* onClick navigate back to top */}
        <div className="z-10 top-0 sticky flex border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950">
          <div className="p-2 hover:bg-white/10 rounded-full my-auto mx-2">
            {/* onClick navigate one page back ../ */}
            <VscArrowLeft size={20} />
          </div>
          <div className="flex flex-col px-6 py-1 font-medium">
            <h2 className="text-xl">{userProfile.name}</h2>
            <p className="text-gray-500 text-sm">
              {numberOfPosts} {numberOfPosts === 1 ? "post" : "posts"}
            </p>
          </div>
        </div>
        {/* PROFILE HEADER */}
        <div className="flex flex-col w-full">
          <div className="relative h-48 bg-slate-600 w-full">
            <Image
              src={userProfile.avatar_url}
              width={140}
              height={140}
              alt={`${userProfile.name}'s Profile Image`}
              className="rounded-full border-2 border-black absolute bottom-0 left-0 -mb-[70px] ml-4"
            />
          </div>
          <div className="mb-4 pt-3 px-4 flex flex-col">
            <div className="flex flex-row justify-between h-[70px]">
              {/* image and ownProfile - (set up profile) OR !ownProfile - (flex
              flex-row - threeDots Message Notify FollowButton) */}
              <div></div>
              {ownProfile ? (
                <button className="flex justify-start border border-slate-400 hover:bg-white/10 transition duration-200 rounded-full h-fit py-1 px-4">
                  Set up profile
                </button>
              ) : (
                <div>a</div>
              )}
            </div>
            <div className="flex flex-col mb-3">
              <h2 className="text-lg font-semibold">{userProfile.name}</h2>
              <h2 className="text-gray-500">@{userProfile.username}</h2>
            </div>
            <div>bio ?</div>
            <div>links / joined at...</div>
            <div>Follwing and followers</div>
          </div>
        </div>
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        {/* {currentUser?.user_metadata.user_name !== userProfile.username ? ( */}
        {!ownProfile && (
          <div>
            <FollowButton
              isUserFollowingProfile={isUserFollowingProfile}
              userProfileId={userProfile.id}
              currentUserId={currentUser?.id}
            />
          </div>
        )}
        <div>
          <p>Joined {userProfile.created_at}</p>
        </div>
        <div className="flex flex-row space-x-4">
          <h2>{following ? following.length : 0} Following</h2>
          <h2>{followers ? followers.length : 0} Followers</h2>
        </div>
        {!ownProfile && (
          <div>
            {commonFollowers.length === 0 ? (
              <h2>Not follwed by anyone you're following</h2>
            ) : (
              <h2>Followed by ... and x others you follow</h2>
            )}
          </div>
        )}
        <h1>Tweets of {userProfile.username}</h1>
        <pre>{JSON.stringify(userTweets, null, 2)}</pre>
      </div>
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
