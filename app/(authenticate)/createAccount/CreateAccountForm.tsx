"use client";

import { BsGithub } from "react-icons/bs";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormEvent, useRef, useState } from "react";
import { VscArrowLeft } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import Messages from "../login/messages";

export default function CreateAccountForm() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
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

  const handleSignUpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidityError(null);
    const enteredEmail = emailRef.current?.value;
    const enteredPassword = passwordRef.current?.value;
    const enteredUsername = usernameRef.current?.value;
    const enteredName = nameRef.current?.value;

    if (!enteredEmail || !enteredPassword || !enteredUsername || !enteredName) {
      return;
    }

    const enteredEmailIsValid = checkEmail(enteredEmail);
    const enteredPasswordIsValid = checkPassword(enteredPassword);
    const enteredUsernameIsValid =
      !enteredUsername.includes(" ") && enteredUsername.length >= 3;
    const enteredNameIsValid = enteredName !== "" && enteredName.length >= 3;

    if (!enteredEmailIsValid) setValidityError("Invalid email.");
    if (!enteredPasswordIsValid)
      setValidityError("Password must be at least 6 characters long.");
    if (!enteredUsernameIsValid)
      setValidityError(
        "Username must be longer than 3 characters and not contain any white spaces"
      );
    if (!enteredNameIsValid)
      setValidityError("Name must be longer than 3 characters");

    const formIsValid =
      enteredEmailIsValid &&
      enteredPasswordIsValid &&
      enteredUsernameIsValid &&
      enteredNameIsValid;

    if (!formIsValid) {
      return;
    }

    if (formRef.current) {
      formRef.current.submit();
    }
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

      <div
        className="flex flex-row py-2 space-x-2 cursor-pointer hover:bg-white/10 transition-all ease-out"
        onClick={() => setValidityError("reset")}
      >
        <VscArrowLeft size={20} className="my-auto" />
        <span onClick={() => router.push("/")}>Back to Sign in</span>
      </div>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2"
        action="/auth/sign-up"
        method="post"
        ref={formRef}
        onSubmit={handleSignUpSubmit}
      >
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

        <label className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2">
          <span className="group-focus-within:text-blue-500">Username</span>
          <input
            className="bg-inherit outline-none group"
            type="text"
            name="username"
            ref={usernameRef}
            required
          />
        </label>
        <label className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2">
          <span className="group-focus-within:text-blue-500">Name</span>
          <input
            className="bg-inherit outline-none group"
            type="text"
            name="name"
            ref={nameRef}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 rounded px-4 py-2 text-white mb-2"
        >
          Sign Up
        </button>
        {validityError && validityError !== "reset" && (
          <p className="my-4 p-4 bg-neutral-900 text-center">{validityError}</p>
        )}

        {validityError !== "reset" && <Messages />}
      </form>
    </div>
  );
}
