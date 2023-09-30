import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Login from "./login/page";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) console.log(error);

  if (session) redirect("/home");

  return (
    <div className="container mx-auto my-auto px-16 py-16">
      <div className="flex justify-center">
        <Login />
      </div>
    </div>
  );
}
