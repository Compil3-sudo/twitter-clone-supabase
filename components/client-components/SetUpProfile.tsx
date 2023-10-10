"use client";

import { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import { MdAddAPhoto } from "react-icons/md";
import Avatar from "./Avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const SetUpProfile = ({ userProfile }: { userProfile: Profile }) => {
  const [showModal, setShowModal] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const updateProfile = async ({ avatar_url }: { avatar_url: string }) => {
    try {
      // setLoading(true);

      const updatedProfile = {
        ...userProfile,
        avatar_url: avatar_url,
      };

      let { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) throw error;
      router.refresh();
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    }
    // finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex justify-start border border-slate-600 hover:bg-white/10 transition duration-200 rounded-full h-fit py-1 px-4"
      >
        Set up profile
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {/* <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Pick a profile picture</h1>
            <p className="text-gray-500 mb-5">
              Have a favorite selfie? Upload it now.
            </p>
            <div className="flex justify-center align-middle my-16">
              <button
                onClick={changeImage}
                className="absolute top-1/2 bg-slate-700 rounded-full p-2 hover:bg-opacity-90 transition duration-200"
              >
                <MdAddAPhoto size={25} />
              </button>
              <div className="border-4 border-white rounded-full">
                <Image
                  src={userProfile.avatar_url}
                  height={175}
                  width={175}
                  alt="Profile Image"
                  className="rounded-full border-2 border-black"
                />
              </div>
            </div>
            <div className="flex justify-center my-5">
              <button className="border rounded-full py-3 w-full hover:bg-white/10 transition duration-200">
                Skip for now
              </button>
            </div>
          </div> */}
          <Avatar
            uid={userProfile.id}
            url={userProfile.avatar_url}
            size={140}
            onUpload={(url) => {
              updateProfile({ avatar_url: url });
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default SetUpProfile;
