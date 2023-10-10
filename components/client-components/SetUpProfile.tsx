"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import Image from "next/image";
import Avatar from "./Avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Logo from "public/static/rares_favicon-light-32x32.png";

const SetUpProfile = ({ userProfile }: { userProfile: Profile }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const [updatedAvatar, setUpdatedAvatar] = useState(false);
  const router = useRouter();

  const bioTextRef = useRef<HTMLTextAreaElement>(null);
  const bioMaxLength = 160;

  const handleChange = () => {
    if (bioTextRef.current) {
      bioTextRef.current.style.height = "auto";
      bioTextRef.current.style.height = `${Math.min(
        bioTextRef.current.scrollHeight,
        bioMaxLength
      )}px`;
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const updatedName = formData.get("profileName")?.toString();
      const updatedBio = formData.get("profileBio")?.toString();

      const updatedProfile = {
        ...userProfile,
        name: updatedName ? updatedName : userProfile.name,
        bio: updatedBio,
      };

      const { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) throw error;
      router.refresh();
      setShowProfileModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAvatar = async ({ avatar_url }: { avatar_url: string }) => {
    try {
      setUpdatedAvatar(false);

      const updatedProfile = {
        ...userProfile,
        avatar_url: avatar_url,
      };

      let { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) throw error;
      router.refresh();
      // alert("Profile updated!");
    } catch (error) {
      console.log(error);
      alert("Error updating the data!");
    } finally {
      setUpdatedAvatar(true);
    }
  };

  const nextModal = () => {
    setShowAvatarModal(false);
    setShowProfileModal(true);
  };

  return (
    <>
      <button
        onClick={() => setShowAvatarModal(true)}
        className="flex justify-start border border-slate-600 hover:bg-white/10 transition duration-200 rounded-full h-fit py-1 px-4"
      >
        Set up profile
      </button>

      {showAvatarModal && (
        <Modal onClose={() => setShowAvatarModal(false)}>
          <div className="bg-slate-950 rounded-2xl py-4 px-10 flex flex-col">
            <Image
              src={Logo}
              width={32}
              height={32}
              alt="RT Logo"
              className="mb-5 self-center"
            />

            <div className="flex flex-col">
              <Avatar
                userId={userProfile.id}
                avatar_url={userProfile.avatar_url}
                size={175}
                onUpload={(url) => {
                  updateAvatar({ avatar_url: url });
                }}
              />
              <div className="flex justify-center my-5">
                <button
                  onClick={nextModal}
                  className="border rounded-full py-3 w-full hover:bg-white/10 transition duration-200"
                >
                  {updatedAvatar ? "Next" : "Skip for now"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showProfileModal && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <div className="bg-slate-950 rounded-2xl py-4 px-10 flex flex-col">
            <Image
              src={Logo}
              width={32}
              height={32}
              alt="RT Logo"
              className="mb-5 self-center"
            />

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-4">
                Change your name or bio
              </h1>
              <form action={updateProfile} className="flex flex-col">
                <label
                  className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
                  htmlFor="profileName"
                >
                  <span className="group-focus-within:text-blue-500">Name</span>
                  <input
                    className="bg-inherit outline-none group"
                    name="profileName"
                    placeholder={userProfile.name}
                  />
                </label>
                <label
                  className="group focus-within:outline-blue-500 focus-within:outline-2 flex flex-col text-md outline outline-1 outline-slate-700 rounded-lg p-2 my-2"
                  htmlFor="profileBio"
                >
                  <span className="group-focus-within:text-blue-500">Bio</span>
                  <textarea
                    ref={bioTextRef}
                    onChange={handleChange}
                    maxLength={bioMaxLength}
                    name="profileBio"
                    // add invisible scrollbar
                    className="bg-transparent border-none outline-none resize-none pt-2"
                    placeholder={userProfile.bio || ""}
                  />
                </label>
                <div className="flex justify-center my-5">
                  <button
                    type="submit"
                    className="border rounded-full py-3 w-full hover:bg-white/10 transition duration-200"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SetUpProfile;
