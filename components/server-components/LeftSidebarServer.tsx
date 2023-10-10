import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LeftSidebar from "../LeftSidebar";
import ComposeTweetServer from "./ComposeTweetServer";

export const dynamic = "force-dynamic";

const LeftSidebarServer = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();
  if (!currentUserProfile) return;

  return (
    <LeftSidebar
      user={currentUserProfile}
      composeTweet={<ComposeTweetServer user={currentUserProfile} />}
    />
  );
};

export default LeftSidebarServer;
