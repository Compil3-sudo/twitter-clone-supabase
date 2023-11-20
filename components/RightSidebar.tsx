import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import SuggestProfilesPanel from "./client-components/SuggestProfilesPanel";
import SuggestTrendingPanel from "./client-components/SuggestTrendingPanel";
import SearchInput from "./client-components/SearchInput";

export const dynamic = "force-dynamic";

const RightSidebar = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const userId = user.id;

  // just get 3 profiles and exclude the authenticated user
  // only suggest "unknown" profile => auth user is not already following them

  // SUPABASE FUNCTION
  //   CREATE OR REPLACE FUNCTION get_profiles_to_follow(
  //   authenticated_user_id UUID,
  //   profile_limit INT
  // )
  // RETURNS TABLE (
  //   id UUID,
  //   username TEXT,
  //   name TEXT,
  //   bio TEXT,
  //   avatar_url TEXT
  // )
  // AS $$
  // BEGIN
  //   RETURN QUERY
  //   SELECT p.id, p.username, p.name, p.bio, p.avatar_url
  //   FROM profiles AS p
  //   WHERE p.id != authenticated_user_id
  //   AND p.id NOT IN (
  //     SELECT f.followed_id
  //     FROM followers AS f
  //     WHERE f.follower_id = authenticated_user_id
  //   )
  //   LIMIT profile_limit;
  // END;
  // $$ LANGUAGE plpgsql;

  const { data: followProfiles, error: followProfilesError } =
    await supabase.rpc("get_profiles_to_follow", {
      authenticated_user_id: userId, // Pass the authenticated user's ID
      profile_limit: 3, // limit the number of profiles to fetch to 3
    });

  if (followProfilesError) console.log(followProfilesError);

  return (
    <div className="hidden sticky top-0 overflow-y-scroll no-scrollbar h-screen lg:flex flex-col max-w-[350px] w-full mx-4">
      <div className="fixed top-0 z-10 bg-slate-950 py-2 flex flex-col max-w-[350px] w-full">
        <SearchInput currentUserId={user.id} />
      </div>
      <SuggestProfilesPanel followProfiles={followProfiles} userId={userId} />
      <SuggestTrendingPanel />
    </div>
  );
};

export default RightSidebar;
