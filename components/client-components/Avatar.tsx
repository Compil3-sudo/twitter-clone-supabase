"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { MdAddAPhoto } from "react-icons/md";

export default function Avatar({
  userId,
  avatar_url,
  size,
  onUpload,
}: {
  userId: Profile["id"];
  avatar_url: Profile["avatar_url"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const helper = avatar_url.split("/");
      const oldAvatar = helper[helper.length - 1];
      const help = oldAvatar.split(".")[0];
      const prevNum = Number(help.split("-")[1]);
      const avatarHelp = isNaN(prevNum) ? 0 : prevNum;
      const random = (avatarHelp + 1) % 10;

      const { error: deleteError } = await supabase.storage
        .from(`avatars`)
        .remove([`${userId}/${oldAvatar}`]);

      if (deleteError) throw deleteError;

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar-${random}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from(`avatars`)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      onUpload(
        process.env.NEXT_PUBLIC_SUPABASE_URL +
          "/storage/v1/object/public/avatars/" +
          filePath
      );
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Pick a profile picture</h1>
      <p className="text-gray-500 mb-5">
        Have a favorite selfie? Upload it now.
      </p>
      <div className="flex justify-center align-middle my-16">
        <label
          htmlFor="addAvatar"
          className="absolute z-10 top-1/2 cursor-pointer bg-slate-700 rounded-full p-2 hover:bg-opacity-90 transition duration-200"
        >
          <MdAddAPhoto size={25} />
        </label>
        <input
          type="file"
          id="addAvatar"
          className="top-1/2 hidden absolute"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <div className="border-4 border-white rounded-full">
          <div className="flex-none overflow-hidden w-44 h-44">
            <div className="w-full h-full relative">
              <Image
                src={avatar_url}
                fill
                className="rounded-full object-cover border-2 border-black"
                alt="Profile Image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
