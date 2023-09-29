import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Login from "./login/page";
import { cookies } from "next/headers";
import ComposeTweet from "@/components/ComposeTweet";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const tweets = await supabase.from("tweets").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <h1>Hello World</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      {/* currently also contains logout - separate later */}
      <Login />
      <h1>-</h1>
      <h1>-</h1>
      <h2>Create new Tweet</h2>
      <ComposeTweet user={user} />
      <h1>-</h1>
      <h1>-</h1>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
