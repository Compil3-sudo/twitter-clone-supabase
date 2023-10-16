import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InfiniteFeed from "@/components/client-components/InfiniteFeed";
import MainHeader from "@/components/client-components/MainHeader";
import ComposeTweetServer from "@/components/server-components/ComposeTweetServer";
import InfiniteFeedProvider from "@/components/context/InfiniteFeedContext";
import ComposeReplyServer from "@/components/server-components/ComposeReplyServer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // TODO IMPORTANT: make user state management across the entire app
  // => only fetch currentUser and his profile once after login after session
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  // REMOVE HOTFIX AFTER USER STATE MANAGEMENT
  if (!currentUserProfile) redirect("/");

  const { data, error } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
    .order("created_at", { ascending: false })
    .limit(10);

  const downloadMedia = async (tweets: any) => {
    // const paths = [] as string[];

    // tweets.forEach((tweet: any) => {
    //   if (tweet.media_id) {
    //     paths.push(
    //       `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`
    //     );
    //   }
    // });

    // const { data, error } = await supabase.storage
    //   .from("tweets")
    //   .createSignedUrls(paths, 60);

    // console.log(data);
    // const tweetsWithMedia = data?.map((signedMedia) => ({
    //   tweetMediaId: signedMedia.path?.split("/")[1].split(".")[0],
    //   mediaUrl: signedMedia.signedUrl,
    // }));

    // const mediaDictionary: Record<string, string> = {};
    // data?.forEach((signedMedia) => {
    //   const key = signedMedia.path?.split("/")[1].split(".")[0];

    //   if (key) {
    //     mediaDictionary[key] = signedMedia.signedUrl;
    //   } else {
    //     console.log("Error with key for: ", signedMedia);
    //   }
    // });
    // console.log(tweetsWithMedia);
    // const mediaURL = data;

    // let mediaType;

    // if (tweet.media_extension === "mp4") {
    //   // setMediaType("video");
    //   mediaType = "video";
    // } else {
    //   // setMediaType("image");
    //   mediaType = "image";
    // }

    // const media_url = URL.createObjectURL(data);
    // setMediaUrl(data?.signedUrl || null);
    // return { mediaURL, mediaType };
    // const mediaDictionary: Record<string, string> = {};
    // tweets.forEach(async (tweet: any) => {
    //   if (tweet.media_id) {
    //     const path = `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`;
    //     const { data, error } = await supabase.storage
    //       .from("tweets")
    //       .createSignedUrl(path, 60);

    //     if (data) mediaDictionary[tweet.media_id] = data.signedUrl;
    //     console.log(mediaDictionary);
    //   }
    // });
    // console.log(mediaDictionary);

    // const mediaDictionary: Record<string, string> = {};

    let tweetsWithMedia = [];
    let mediaUrl = null;

    for (const tweet of tweets) {
      if (tweet.media_id) {
        const path = `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`;
        const { data, error } = await supabase.storage
          .from("tweets")
          .createSignedUrl(path, 60);

        if (data) {
          // mediaDictionary[tweet.media_id] = data.signedUrl;
          mediaUrl = data.signedUrl;
        }
      }
      const updatedTweet = {
        ...tweet,
        // author: tweet.author, // why am I setting this if tweet.author already exists ?
        user_has_liked: !!tweet.likes.find(
          (like: any) => like.user_id === user.id
        ),
        likes: tweet.likes.length,
        replies: tweet.replies.length,
        // mediaUrl: tweet.media_id ? mediaDictionary[tweet.media_id] : null,
        mediaUrl: mediaUrl,
      };
      tweetsWithMedia.push(updatedTweet);
    }

    // console.log(mediaDictionary);

    // return { mediaDictionary, tweetsWithMedia };
    return tweetsWithMedia;
  };

  // const { mediaDictionary, tweetsWithMedia } = await downloadMedia(data);
  // const tweetsWithMedia = downloadMedia(data);

  // const tweetsWithMedia = await downloadMedia(data);
  // console.log(tweetsWithMedia)

  // console.log("MEDIA DICTIONARY: ", mediaDictionary);
  // console.log("TWEETS WITH MEDIA: ", tweetsWithMedia);

  const downloadMedia2 = async (tweets: any) => {
    let tweetsWithMedia = [];
    let mediaUrl = null;

    for (const tweet of tweets) {
      if (tweet.media_id) {
        const path = `${tweet.author.id}/${tweet.media_id}.${tweet.media_extension}`;
        mediaUrl = await supabase.storage
          .from("tweets")
          .download(path)
          .then((data) => {
            if (data.data) {
              return URL.createObjectURL(data.data);
            }
          });
      }
      const updatedTweet = {
        ...tweet,
        // author: tweet.author, // why am I setting this if tweet.author already exists ?
        user_has_liked: !!tweet.likes.find(
          (like: any) => like.user_id === user.id
        ),
        likes: tweet.likes.length,
        replies: tweet.replies.length,
        // mediaUrl: tweet.media_id ? mediaDictionary[tweet.media_id] : null,
        mediaUrl: mediaUrl,
      };
      tweetsWithMedia.push(updatedTweet);
    }

    return tweetsWithMedia;
  };

  const tweetsWithMedia = await downloadMedia(data);

  // const recentTweets =
  //   data?.map((tweet) => ({
  //     ...tweet,
  //     author: tweet.author!, // there is no way for a tweet to exist without an author, because each tweet has a user_id (:= author's id)
  //     user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
  //     likes: tweet.likes.length,
  //     replies: tweet.replies.length,
  //     mediaUrl: tweet.media_id ? mediaDictionary[tweet.media_id] : null,
  //   })) ?? [];

  const recentTweets = tweetsWithMedia as TweetWithAuthor[];

  // console.log("TWEETS: ", recentTweets);

  // fetch who the user is following
  const { data: userFollowing } = await supabase
    .from("followers")
    .select("followed_id")
    .eq("follower_id", currentUserProfile.id);

  const userFollowingIds =
    userFollowing?.map((followingId) => followingId.followed_id) || [];

  // only fetch tweets, where tweet author is followed by currentUser
  const { data: following, error: followingError } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id), replies(user_id)") // TODO: IMPORTANT: check if nested replies affects count
    .in("user_id", userFollowingIds)
    .order("created_at", { ascending: false })
    .limit(10);

  const followingTweets =
    following?.map((tweet) => ({
      ...tweet,
      author: tweet.author!, // there is no way for a tweet to exist without an author, because eacht tweet has a user_id (:= author's id)
      user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
      likes: tweet.likes.length,
      replies: tweet.replies.length,
    })) ?? [];

  // IMPORTANT:
  // ROUTING: - dynamic tweet page
  // /username/tweet/[tweetId]
  // CLICK ON REPLY:
  // /REPLYAUTHOR-USERNAME/tweet/[replyId]

  return (
    <>
      <InfiniteFeedProvider>
        <MainHeader />
        <ComposeTweetServer user={currentUserProfile} />
        <InfiniteFeed
          user={currentUserProfile}
          firstTweetsPage={recentTweets}
          firstFollowingTweetsPage={followingTweets}
          userFollowingIds={userFollowingIds}
          ComposeReply={<ComposeReplyServer user={currentUserProfile} />}
        />
      </InfiniteFeedProvider>
    </>
  );
}
