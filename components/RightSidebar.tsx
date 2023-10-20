import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { BiSearch } from "react-icons/bi";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import WhoToFollowProfile from "./client-components/WhoToFollowProfile";
import SuggestProfilesPanel from "./client-components/SuggestProfilesPanel";
import SuggestTrendingPanel from "./client-components/SuggestTrendingPanel";

export const dynamic = "force-dynamic";

const RightSidebar = async ({ params }: any) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  console.log(params);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const userId = user.id;

  // TODO: improve algorithm suggestion, based on mutual connections
  // could add other factors ?

  // for now just get 3 profiles and exclude the authenticated user
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
        <div className="group flex bg-[#16181C] rounded-full p-2 px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
          <BiSearch className="group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#16181C] outline-none focus:bg-slate-950"
          />
        </div>
      </div>
      <SuggestProfilesPanel followProfiles={followProfiles} userId={userId} />
      <SuggestTrendingPanel />
    </div>
  );
};

export default RightSidebar;
