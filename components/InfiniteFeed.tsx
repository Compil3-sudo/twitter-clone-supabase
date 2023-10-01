import ComposeTweet from "@/components/client-components/ComposeTweet";
import Tweet from "@/components/client-components/Tweet";
import MainHeader from "@/components/client-components/MainHeader";

const InfiniteFeed = ({ user, tweets }: any) => {
  return (
    <main className="flex flex-col max-w-[600px] w-full h-full min-h-screen mx-2 border-l border-r">
      <MainHeader />
      <ComposeTweet user={user} />
      {/* TWEETS FEED */}
      <div className="flex flex-col items-center">
        {tweets.map((tweet: any) => (
          <Tweet key={tweet.id} user={user} tweet={tweet} />
        ))}
      </div>
      {/* TWEETS FEED */}
    </main>
  );
};

export default InfiniteFeed;
