"use client";

// change to server component if you want to use the form
// for email sign-up

// import Link from "next/link";
import Messages from "./messages";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const supabase = createClientComponentClient();

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        // redirectTo: `${location.origin}/auth/callback`,
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) console.log(error);
  }

  return (
    <div className="flex flex-col w-fit self-center px-8 sm:max-w-md justify-center gap-2">
      <h1>Change between login / create account</h1>
      <h1>
        Change this into a modal and ask for each detail after email is
        confirmed
      </h1>
      <h2>make default profile picture</h2>
      <h2>
        generate random unique username based on name - let user change it later
      </h2>
      <form
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

        <label className="text-md" htmlFor="email">
          Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="name"
          placeholder="name"
          required
        />

        <h2>ask for this after email confirmed</h2>
        <label className="text-md" htmlFor="email">
          Username
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="username"
          placeholder="username"
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
      </form>
      <button
        onClick={signInWithGitHub}
        className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
      >
        Login with Github
      </button>
    </div>
  );
}
