import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NestedRepliesClient from "../client-components/NestedRepliesClient";

export const dynamic = "force-dynamic";

const NestedRepliesServer = async ({ parentReply }: any) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase
    .from("replies")
    .select("*, nestedReplies: replies(*)")
    .eq("parent_reply_id", parentReply.id);

  return (
    <>
      <NestedRepliesClient replies={data} />
    </>
  );
};

export default NestedRepliesServer;
