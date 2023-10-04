"use client";

// change to server component if you want to use the form
// for email sign-up

// import Link from "next/link";
// import Messages from "./messages";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        // redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    console.log("data from github signin: ", data);
    if (error) {
      console.log(error);
    }
    // else {
    //   router.push("/home");
    // }
  }

  return (
    <div className="flex flex-col w-fit self-center px-8 sm:max-w-md justify-center gap-2">
      {/* <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action="/auth/sign-in"
        method="post"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">
          Sign In
        </button>
        <button
          formAction="/auth/sign-up"
          className="border border-gray-700 rounded px-4 py-2 text-white mb-2"
        >
          Sign Up
        </button>
        <Messages />
      </form> */}
      <button
        onClick={signInWithGitHub}
        className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
      >
        Login with Github
      </button>
    </div>
  );
}
