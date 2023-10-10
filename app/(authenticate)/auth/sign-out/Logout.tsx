"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const Logout = () => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) console.log(error);

    router.push("/");
  }

  return (
    <button onClick={signOut} className="rounded-xl px-4 py-2 text-white w-max">
      Log Out
    </button>
  );
};

export default Logout;
