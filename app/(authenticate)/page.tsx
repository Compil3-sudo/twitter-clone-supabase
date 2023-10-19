import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Login from "./login/Login";
import Logo from "public/static/android-chrome-192x192.png";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) console.log(error);

  if (session) redirect("/home");

  return (
    <div className="grid grid-flow-col h-screen place-items-center">
      <div className="flex flex-col justify-center">
        <div className="self-center p-6">
          <h1 className="text-3xl font-bold py-2">Twitter Clone by Compil3</h1>
          <h2 className="text-xl">Frameworks and tools:</h2>
          <ul className="px-6">
            <li>NextJs (Version 13.5.3 with App Router)</li>
            <li>Supabase (PostgreSQL DB, Authentication, Storage)</li>
            <li>React</li>
            <li>TailwindCSS</li>
          </ul>
          <div className="flex justify-center mt-5">
            <Image src={Logo} width={192} height={192} alt="Logo" />
          </div>
          <h3 className="mt-4">If you don't want to create an account,</h3>
          <h3 className="mb-2">
            you can also log in using the shared guest account:
          </h3>
          <h4>Email: guest@email.com</h4>
          <h4>Password: 123456</h4>
        </div>
      </div>
      <Login />
    </div>
  );
}
