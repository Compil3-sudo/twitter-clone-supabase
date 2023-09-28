import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Login from "./login/page";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const tweets = await supabase.from("tweets").select("*");

  return (
    <>
      <h1>Hello World</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <Login />
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <h1>-</h1>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
