"use client";

import { BsGithub } from "react-icons/bs";
// change to server component if you want to use the form
// for email sign-up

import Messages from "./messages";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [validityError, setValidityError] = useState<string | null>(null);

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) console.log(error);
  }

  const checkEmail = (email: string) => {
    if (
      email.includes("@") &&
      email.includes(".") &&
      email.split("@")[0].length > 0 &&
      email.split("@")[1].length > 0 &&
      email.split("@")[1].split(".").length == 2
    ) {
      return true;
    }
    return false;
  };

  const checkPassword = (password: string) => {
    if (password.length >= 6) return true;
    return false;
  };

  const handleSignInSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidityError(null);
    const enteredEmail = emailRef.current?.value;
    const enteredPassword = passwordRef.current?.value;

    if (!enteredEmail || !enteredPassword) {
      return;
    }

    const enteredEmailIsValid = checkEmail(enteredEmail);
    const enteredPasswordIsValid = checkPassword(enteredPassword);

    if (!enteredEmailIsValid) setValidityError("Invalid email.");
    if (!enteredPasswordIsValid)
      setValidityError("Password must be at least 6 characters long.");

    const formIsValid = enteredEmailIsValid && enteredPasswordIsValid;

    if (!formIsValid) {
      return;
    }

    if (formRef.current) formRef.current.submit();
  };

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

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2"
        action="/auth/sign-in"
        method="post"
        ref={formRef}
        onSubmit={handleSignInSubmit}
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
        <label className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2">
          <span className="group-focus-within:text-blue-500">Email</span>
          <input
            className="bg-inherit outline-none group"
            type="email"
            name="email"
            ref={emailRef}
            required
          />
        </label>

        <label className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2">
          <span className="group-focus-within:text-blue-500">Password</span>
          <input
            className="bg-inherit outline-none group"
            type="password"
            name="password"
            ref={passwordRef}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-green-700 rounded px-4 py-2 text-white mb-2"
        >
          Sign In
        </button>
        {validityError && validityError !== "reset" && (
          <p className="my-4 p-4 bg-neutral-900 text-center">{validityError}</p>
        )}

        <h2 className="text-lg">Don't have an account?</h2>

        <button
          onClick={() => {
            router.push("/createAccount");
          }}
          className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
        >
          Create account
        </button>

        {validityError !== "reset" && <Messages />}
      </form>
    </div>
  );
}
