import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { BiSearch } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "@/components/client-components/FollowButton";
import { BsThreeDots } from "react-icons/bs";

export const dynamic = "force-dynamic";

const RightSidebar = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  // TODO: improve algorithm suggestion, based on mutual connections
  // could add other factors ?

  // for now just get 3 profiles and exclude the authenticated user
  // only suggest "unknown" profile => auth user is not already following them

  // SUPABASE FUNCTION
  // CREATE OR REPLACE FUNCTION get_profiles_to_follow(authenticated_user_id UUID)
  // RETURNS TABLE (
  //   id UUID,
  //   username TEXT,
  //   name TEXT,
  //   avatar_url TEXT
  // )
  // AS $$
  // BEGIN
  //   RETURN QUERY
  //   SELECT p.id, p.username, p.name, p.avatar_url
  //   FROM profiles AS p
  //   WHERE p.id != authenticated_user_id
  //   AND p.id NOT IN (
  //     SELECT f.followed_id
  //     FROM followers AS f
  //     WHERE f.follower_id = authenticated_user_id
  //   )
  //   LIMIT 3;
  // END;
  // $$ LANGUAGE plpgsql;

  const { data: followProfiles, error: followProfilesError } =
    await supabase.rpc("get_profiles_to_follow", {
      authenticated_user_id: userId, // Pass the authenticated user's ID
    });

  // console.log(followProfiles);
  // console.log(followProfilesError);

  return (
    <div className="hidden lg:flex flex-col max-w-[350px] w-full mx-4">
      <div className="top-0 fixed py-2 flex flex-col max-w-[350px] w-full">
        <div className="group flex bg-[#16181C] rounded-full p-2  px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
          <BiSearch className="group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#16181C] outline-none focus:bg-slate-950"
          />
        </div>
        <div className="flex flex-col bg-[#16181C] rounded-xl pt-2 mt-5">
          <h2 className="p-2 text-lg font-bold">Who to Follow</h2>
          {followProfiles?.map((followProfile: any) => (
            <div
              key={followProfile.id}
              className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200"
            >
              <div className="flex-none my-auto">
                <Image
                  src={followProfile.avatar_url}
                  width={40}
                  height={40}
                  alt="Profile Image"
                  className="rounded-full"
                />
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-col w-full">
                  <h2 className="hover:underline transition duration-200">
                    {followProfile.name}
                  </h2>
                  <h2 className="text-gray-500">@{followProfile.username}</h2>
                </div>
                <div className="flex flex-col w-fit justify-center items-end">
                  <FollowButton
                    userProfileId={followProfile.id}
                    currentUserId={userId}
                    isUserFollowingProfile={false}
                  />
                </div>
              </div>
            </div>
          ))}
          <Link
            href={"/"}
            className="rounded-b-xl text-sky-500 hover:bg-white/10 transition duration-200 px-2 py-4"
          >
            Show more
          </Link>
        </div>
        <div className="flex flex-col bg-[#16181C] rounded-xl pt-2 mt-5">
          <h2 className="p-2 text-lg font-bold">Trending</h2>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200"
              >
                <div className="flex w-full justify-between">
                  <div className="flex flex-col w-full">
                    <h2 className="">Trend #{index}</h2>
                  </div>
                  <div className="flex flex-col w-fit justify-center items-end">
                    <div className="self-end rounded-full p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                      <BsThreeDots />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <Link
            href={"/"}
            className="rounded-b-xl text-sky-500 hover:bg-white/10 transition duration-200 px-2 py-4"
          >
            Show more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
