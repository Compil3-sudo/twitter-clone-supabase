"use client";

import { BsGithub } from "react-icons/bs";
// change to server component if you want to use the form
// for email sign-up

// import Link from "next/link";
import Messages from "./messages";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { VscArrowLeft } from "react-icons/vsc";

export default function Login() {
  const [createAccount, setCreateAccount] = useState(false);
  const supabase = createClientComponentClient<Database>();

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        // redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) console.log(error);
  }

  return (
    <div className="flex flex-col w-fit self-center px-8 sm:max-w-md justify-center gap-2">
      <h1 className="text-5xl mb-6">Happening now</h1>
      <h1 className="text-2xl mb-2">Join today.</h1>
      <button
        onClick={signInWithGitHub}
        className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
      >
        <div className="flex flex-row justify-center space-x-2">
          <BsGithub size={20} className="my-auto" />
          <span>Sign in with Github</span>
        </div>
      </button>

      <div className="flex items-center">
        <div className="w-1/2 border-t border-gray-400"></div>
        <div className="mx-4 text-gray-400">or</div>
        <div className="w-1/2 border-t border-gray-400"></div>
      </div>

      {createAccount && (
        <>
          <div
            className="flex flex-row py-2 space-x-2 cursor-pointer hover:bg-white/10 transition-all ease-out"
            onClick={() => setCreateAccount(false)}
          >
            <VscArrowLeft size={20} className="my-auto" />
            <span>Back to Sign in</span>
          </div>
          <h2 className="text-lg">Create your account</h2>
        </>
      )}

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2"
        action="/auth/sign-in"
        method="post"
      >
        {/* <label
          className="group h-16 focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
          htmlFor="email"
        >
          <span className="mt-3 text-xl group-focus-within:-translate-y-4 group-focus-within:text-base transition-all ease-out duration-600 group-focus-within:text-blue-500">
            Email
          </span>
          <input
            className="absolute mt-6 bg-inherit outline-none group"
            type="email"
            name="email"
            required
          />
        </label> 
        <label
          className="group h-16 focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
          htmlFor="password"
        >
          <span className="absolute mt-3 text-xl group-focus-within:mt-0 group-focus-within:text-base transition duration-600 group-focus-within:text-blue-500">
            Password
          </span>
          <input
            className="absolute mt-6 bg-inherit outline-none group"
            type="password"
            name="password"
            required
          />
        </label> */}
        <label
          className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
          htmlFor="email"
        >
          <span className="group-focus-within:text-blue-500">Email</span>
          <input
            className="bg-inherit outline-none group"
            type="email"
            name="email"
          />
        </label>

        <label
          className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
          htmlFor="password"
        >
          <span className="group-focus-within:text-blue-500">Password</span>
          <input
            className="bg-inherit outline-none group"
            type="password"
            name="password"
          />
        </label>

        {!createAccount && (
          <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">
            Sign In
          </button>
        )}

        {!createAccount && (
          <>
            <h2 className="text-lg">Don't have an account?</h2>

            <button
              onClick={() => setCreateAccount(true)}
              className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
            >
              Create account
            </button>
          </>
        )}

        {createAccount && (
          <>
            <label
              className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
              htmlFor="username"
            >
              <span className="group-focus-within:text-blue-500">Username</span>
              <input
                className="bg-inherit outline-none group"
                type="text"
                name="username"
                required={createAccount}
              />
            </label>
            <label
              className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
              htmlFor="name"
            >
              <span className="group-focus-within:text-blue-500">Name</span>
              <input
                className="bg-inherit outline-none group"
                type="text"
                name="name"
                required={createAccount}
              />
            </label>
          </>
        )}

        {createAccount && (
          <button
            formAction="/auth/sign-up"
            className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
          >
            Sign Up
          </button>
        )}
        <Messages />
      </form>
    </div>
  );
}
