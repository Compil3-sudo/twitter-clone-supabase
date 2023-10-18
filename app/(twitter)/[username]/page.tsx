import ArrowHeader from "@/components/client-components/ArrowHeader";
import FollowButton from "@/components/client-components/FollowButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import { BiMessageSquareDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import SetUpProfile from "@/components/client-components/SetUpProfile";
import ComposeReplyServer from "@/components/server-components/ComposeReplyServer";
import InfiniteScrollFeed from "@/components/client-components/InfiniteScrollFeed";

export const dynamic = "force-dynamic";

// TODO: IMPORTANT!! - make sure profile page updates / revalidates when it changes
// nextjs seems to make a static page => currently changes only occurr after refresh
const ProfilePage = async ({ params }: { params: { username: string } }) => {
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

  if (error) {
    console.log(error);
  }

  if (!userProfile) {
    // account does NOT exist
    return (
      <>
        <div className="flex flex-col items-center">
          <ArrowHeader title="Profile" />

          <div className="flex flex-col w-full">
            <div className="relative h-48 bg-slate-600 w-full">
              <div className="bg-neutral-700 w-[140px] h-[140px] rounded-full border-2 border-black absolute bottom-0 left-0 -mb-[70px] ml-4" />
            </div>
            <div className="mb-4 pt-3 px-4 flex flex-col">
              <div className="flex flex-row justify-between h-[70px]"></div>
              <div className="flex flex-col mb-3">
                <h2 className="text-lg font-bold">@{params.username}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-16 mx-auto mt-10">
          <h2 className="text-4xl font-bold">This account doesn't exist</h2>
          <h3 className="text-gray-500">Try searching for another.</h3>
        </div>
      </>
    );
  }

  const { data: following, error: followingError } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", userProfile.id);

  const { data: followers, error: followersError } = await supabase
    .from("followers")
    .select("*")
    .eq("followed_id", userProfile.id);

  const ownProfile = currentUserProfile.username === userProfile.username;

  let isUserFollowingProfile = false;
  let commonFollowersIds = [] as Profile["id"][];
  let commonFollowers = [] as Profile[];
  let followersText = "";

  function generateFollowersText(commonFollowers: Profile[]) {
    switch (commonFollowers.length) {
      case 0:
        return "Not follwed by anyone you're following";
      case 1:
        return `Followed by ${commonFollowers[0].name}`;
      case 2:
        return `Followed by ${commonFollowers[0].name} and ${commonFollowers[1].name}`;
      case 3:
        return `Followed by ${commonFollowers[0].name}, ${commonFollowers[1].name}, and ${commonFollowers[2].name}`;
      default:
        return `Followed by ${commonFollowers[0].name}, ${
          commonFollowers[1].name
        }, and ${commonFollowers.length - 2} others you follow`;
    }
  }

  if (!ownProfile) {
    // who is the current user following
    const { data: userFollowing, error: userFollowingError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", currentUserProfile.id);

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
    commonFollowersIds = userProfileFollowers.filter((followerId) =>
      userFollowingIds.includes(followerId)
    );

    const { data: commonFollowersData, error: commonFollowersError } =
      await supabase.from("profiles").select("*").in("id", commonFollowersIds);

    if (commonFollowersData) commonFollowers = commonFollowersData;

    followersText = generateFollowersText(commonFollowers);
  }

  const { data, error: userTweetsError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id), replies(user_id)")
    .eq("user_id", userProfile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const profileTweets =
    data?.map((tweet) => ({
      ...tweet,
      author: tweet.author!,
      user_has_liked: !!tweet.likes.find(
        (like) => like.user_id === currentUserProfile.id
      ),
      likes: tweet.likes.length,
      replies: tweet.replies.length,
    })) ?? [];

  // TODO: fix - this no longer works because of limit...
  // const numberOfPosts = profileTweets?.length; // this no longer works because of limit...
  const numberOfPosts = 0; // this no longer works because of limit...
  return (
    <>
      <div className="flex flex-col items-center">
        {/* PROFILE HEADER */}
        <ArrowHeader title={userProfile.name} numberOfPosts={numberOfPosts} />
        {/* PROFILE HEADER */}
        <div className="flex flex-col w-full">
          <div className="relative h-48 bg-slate-600 w-full">
            <div className="absolute bottom-0 left-0 -mb-[70px] ml-4 flex-none overflow-hidden w-36 h-36">
              <div className="w-full h-full relative">
                <Image
                  src={userProfile.avatar_url}
                  fill
                  className="rounded-full object-cover border-2 border-black "
                  alt={`${userProfile.name}'s Profile Image`}
                />
              </div>
            </div>
          </div>
          <div className="mb-4 pt-3 px-4 flex flex-col">
            <div className="flex flex-row justify-between h-[70px]">
              {/* image and ownProfile - (set up profile) OR !ownProfile - (flex
              flex-row - threeDots Message Notify FollowButton) */}
              <div></div>
              {ownProfile ? (
                <SetUpProfile userProfile={userProfile} />
              ) : (
                <div className="flex flex-row space-x-2 h-fit">
                  {/* idk what to do here ? open some menu for - share profile ? copy link to profile ? mute / block / report ? */}
                  <button className="flex p-1.5 rounded-full border border-slate-600 hover:bg-white/10 transition duration-200">
                    <BsThreeDots size={20} />
                  </button>

                  {/* onClick - send direct message */}
                  <button className="flex p-1.5 rounded-full border border-slate-600 hover:bg-white/10 transition duration-200">
                    <BiMessageSquareDetail size={20} />
                  </button>

                  {/* only show notifications if user is following this profile - TODO: IMPORTANT - revalidate isUserFollowingProfile after unfollow */}
                  {isUserFollowingProfile && (
                    <button className="flex p-1.5 rounded-full border border-slate-600 hover:bg-white/10 transition duration-200">
                      {/* onClick - activate notifications -> send notifications when user posts ? & change icon to filled bell */}
                      <IoIosNotificationsOutline size={20} />
                      {/* <IoIosNotifications size={20} /> */}
                    </button>
                  )}

                  <FollowButton
                    isUserFollowingProfile={isUserFollowingProfile}
                    userProfileId={userProfile.id}
                    currentUserId={currentUserProfile.id}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col mb-3">
              <h2 className="text-lg font-bold">{userProfile.name}</h2>
              <h2 className="text-gray-500">@{userProfile.username}</h2>
            </div>

            <span className="text-sm">{userProfile.bio}</span>

            <p className="text-gray-500 text-sm mb-2">
              Joined {userProfile.created_at.slice(0, 10)}
            </p>

            <div className="flex flex-row space-x-6">
              {/* TODO: onClick show following */}
              <button className="flex flex-row space-x-1">
                <span className="font-semibold">
                  {following ? following.length : 0}
                </span>
                <span className="flex text-gray-500 items-center">
                  Following
                </span>
              </button>

              {/* TODO: onClick show followers */}
              <button className="flex flex-row space-x-1">
                <span className="font-semibold">
                  {followers ? followers.length : 0}
                </span>
                <span className="flex text-gray-500 items-center">
                  Followers
                </span>
              </button>
            </div>

            {!ownProfile && (
              // on click show list of common followers
              <div>
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
          </div>

          <div className="flex flex-row border-b justify-evenly">
            {/* only activate border on click & active tab */}
            {/* inactive tabs are text-gray-500 */}
            <div className="flex w-full justify-center hover:bg-white/10">
              {/* includes reposts */}
              <button className="border-blue-500 border-b-4 py-4">Posts</button>
            </div>

            <div className="flex w-full justify-center text-gray-500 group hover:bg-white/10">
              <button className="group-hover:border-blue-500 border-transparent border-b-4 py-4">
                Replies
              </button>
            </div>

            <div className="flex w-full justify-center text-gray-500 group hover:bg-white/10">
              <button className="group-hover:border-blue-500 border-transparent border-b-4 py-4">
                Media
              </button>
            </div>

            <div className="flex w-full justify-center text-gray-500 group hover:bg-white/10">
              <button className="group-hover:border-blue-500 border-transparent border-b-4 py-4">
                Likes
              </button>
            </div>
          </div>
        </div>

        <InfiniteScrollFeed
          user={currentUserProfile}
          firstTweetsPage={profileTweets}
          ComposeReply={<ComposeReplyServer user={currentUserProfile} />}
          // option={InfiniteScrollFeedOption[2]} // nextjs server forbidden...
          option={"Profile"}
          userProfileId={userProfile.id}
        />
      </div>
    </>
  );
};

export default ProfilePage;

// export async function generateStaticParams() {
//   const supabase = createServerComponentClient<Database>({ cookies });
// const params = useParams();
// console.log(params);

// get user posts here ?

// const tweets = await supabase.from("tweets").select("*").eq("user_id");

// return posts.map((post) => ({
//   slug: post.slug,
// }));
// }
