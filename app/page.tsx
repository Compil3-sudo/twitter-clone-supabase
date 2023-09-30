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
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col justify-center">
        <div className="self-center p-6">
          <h1 className="text-3xl font-bold py-2">Twitter Clone by Compil3</h1>
          <h2 className="text-xl">Frameworks and tools:</h2>
          <ul className="px-6">
            <li>NextJs (Version 13.53 with App Router)</li>
            <li>Supabase (Backend as a Service: PostgreSQL DB)</li>
            <li>React</li>
            <li>TailwindCSS</li>
          </ul>
        </div>
        <Login />
      </div>
    </div>
  );
}
