import ArrowHeader from "@/components/client-components/ArrowHeader";
import WhoToFollowProfile from "@/components/client-components/WhoToFollowProfile";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const Connect = async () => {
  // TODO: OPTIONAL - nice feature add tabs for follow anyone? & follow for you with custom suggestions for auth user?
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const userId = user.id;

  const { data: followProfiles, error: followProfilesError } =
    await supabase.rpc("get_profiles_to_follow", {
      authenticated_user_id: userId, // Pass the authenticated user's ID
      profile_limit: 100, // limit the number of profiles to fetch to 3
    });

  if (followProfilesError) console.log(followProfilesError);

  return (
    <>
      <ArrowHeader title="Connect" />
      <h1 className="text-xl p-4 font-bold">Who to follow</h1>
      {followProfiles && followProfiles.length > 0 ? (
        followProfiles.map((profile) => (
          <WhoToFollowProfile
            key={profile.id}
            userId={userId}
            followProfile={profile}
            isUserFollowingProfile={false}
            showBio={true}
          />
        ))
      ) : (
        <h1>No Profiles to follow.</h1>
      )}
    </>
  );
};

export default Connect;
