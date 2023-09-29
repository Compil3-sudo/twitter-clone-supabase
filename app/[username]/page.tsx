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

  const { data: userTweets } = await supabase
    .from("tweets")
    .select("*")
    .eq("user_id", userProfile.id);

  if (error) {
    console.log(error);
    redirect("/");
  }

  return (
    <>
      <div>ProfilePage of {userProfile.username}</div>
      <pre>{JSON.stringify(userProfile, null, 2)}</pre>
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
