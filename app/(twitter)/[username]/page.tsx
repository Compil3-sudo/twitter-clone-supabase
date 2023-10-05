import FollowButton from "@/components/client-components/FollowButton";
import Tweet from "@/components/client-components/Tweet";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BiMessageSquareDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { VscArrowLeft } from "react-icons/vsc";
// import { useParams } from "next/navigation";

// TODO: IMPORTANT!! - make sure profile page updates / revalidates when it changes
// nextjs seems to make a static page => currently changes only occurr after refresh
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
        {/* TODO: make this a bit prettier */}
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

  // need to check if this tweet author is ok ?
  // I think the author is bugged...need to fix it
  const { data, error: userTweetsError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*)")
    .eq("user_id", userProfile.id)
    .order("created_at", { ascending: false });

  const profileTweets = data?.map((tweet: any) => ({
    ...tweet,
    user_has_liked: !!tweet.likes.find(
      (like: any) => like.user_id === currentUser?.id
    ),
    likes: tweet.likes.length,
  }));

  const numberOfPosts = profileTweets?.length;

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
                <button className="flex justify-start border border-gray-600 hover:bg-white/10 transition duration-200 rounded-full h-fit py-1 px-4">
                  Set up profile
                </button>
              ) : (
                <div className="flex flex-row space-x-2 h-fit">
                  {/* idk what to do here ? open some menu for - share profile ? copy link to profile ? mute / block / report ? */}
                  <button className="flex p-1.5 rounded-full border border-gray-600 hover:bg-white/10 transition duration-200">
                    <BsThreeDots size={20} />
                  </button>
                  {/* onClick - send direct message */}
                  <button className="flex p-1.5 rounded-full border border-gray-600 hover:bg-white/10 transition duration-200">
                    <BiMessageSquareDetail size={20} />
                  </button>
                  {/* onClick - activate notifications -> send notifications when user posts ? & change icon to filled bell */}
                  <button className="flex p-1.5 rounded-full border border-gray-600 hover:bg-white/10 transition duration-200">
                    <IoIosNotificationsOutline size={20} />
                    {/* <IoIosNotifications size={20} /> */}
                  </button>
                  <FollowButton
                    isUserFollowingProfile={isUserFollowingProfile}
                    userProfileId={userProfile.id}
                    currentUserId={currentUser?.id}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col mb-3">
              <h2 className="text-lg font-semibold">{userProfile.name}</h2>
              <h2 className="text-gray-500">@{userProfile.username}</h2>
            </div>

            <div>bio ?</div>

            <div>
              links & <p>Joined {userProfile.created_at.slice(0, 10)}</p>
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
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          {profileTweets?.map((tweet: any) => (
            <Tweet key={tweet.id} user={currentUser} tweet={tweet} />
          ))}
        </div>
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
