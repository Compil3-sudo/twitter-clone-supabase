"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";

const MessageMedia = ({ message }: { message: Message }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("");

  useEffect(() => {
    if (message.media_id) {
      const downloadMedia = async () => {
        try {
          const supabase = createClientComponentClient<Database>();
          const path = `${message.conversation_id}/${message.media_id}.${message.media_extension}`;

          const { data, error } = await supabase.storage
            .from("messages")
            .download(path);
          if (error) {
            throw error;
          }

          if (message.media_extension === "mp4") {
            setMediaType("video");
          } else {
            setMediaType("image");
          }

          const media_url = URL.createObjectURL(data);
          setMediaUrl(media_url);
        } catch (error) {
          console.log("Error downloading media: ", error);
        }
      };

      downloadMedia();
    }
  }, []);

  return (
    <>
      {mediaUrl ? (
        mediaType === "image" ? (
          // variable height unfortunately makes scroll behavior
          // not scroll to bottom after images load :(
          // <img src={mediaUrl} alt="Media" className="w-full h-auto" />
          <div
            style={{ paddingBottom: "100%" }} // Maintain a 1:1 aspect ratio
            className="relative"
          >
            <Image
              src={mediaUrl}
              fill
              className="rounded-xl object-contain"
              alt="Media"
            />
          </div>
        ) : mediaType === "video" ? (
          <video controls>
            <source src={mediaUrl} type={`video/${message.media_extension}`} />
          </video>
        ) : null
      ) : (
        <ImSpinner2 size={50} className="aspect-square mx-auto my-auto" /> // white color for better contrast; user's own messages are blue
      )}
    </>
  );
};

export default MessageMedia;
