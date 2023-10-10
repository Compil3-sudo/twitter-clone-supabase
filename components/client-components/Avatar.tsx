"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Profile["avatar_url"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profile["avatar_url"]>(url);
  const [uploading, setUploading] = useState(false);

  // useEffect(() => {
  //   const helper = url.split("/");
  //   const avatarUrlHelp = helper[helper.length - 1];

  //   async function downloadImage(path: string) {
  //     try {
  //       const { data, error } = await supabase.storage
  //         .from(`avatars`)
  //         .download(`${uid}/` + path);
  //       if (error) {
  //         throw error;
  //       }

  //       const url = URL.createObjectURL(data);
  //       setAvatarUrl(url);
  //     } catch (error) {
  //       console.log("Error downloading image: ", error);
  //     }
  //   }

  //   if (url) {
  //     downloadImage(avatarUrlHelp);
  //   }
  // }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const helper = url.split("/");
      const oldAvatar = helper[helper.length - 1];
      const help = oldAvatar.split(".")[0];
      const prevNum = Number(help.split("-")[1]);
      const avatarHelp = isNaN(prevNum) ? 0 : prevNum;
      const random = (avatarHelp + 1) % 10;

      const { error: deleteError } = await supabase.storage
        .from(`avatars`)
        .remove([`${uid}/${oldAvatar}`]);

      if (deleteError) throw deleteError;

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}/avatar-${random}.${fileExt}`;

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
    <div>
      {url ? (
        <Image
          width={size}
          height={size}
          src={url}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
