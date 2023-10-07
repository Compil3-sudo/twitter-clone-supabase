import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LeftSidebar from "../LeftSidebar";

export const dynamic = "force-dynamic";

const LeftSidebarServer = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LeftSidebar user={user} />;
};

export default LeftSidebarServer;
