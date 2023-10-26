"use client";

import { useEffect, useState } from "react";
import { GoFileMedia } from "react-icons/go";
import { VscClose } from "react-icons/vsc";

type CustomTextAreaProps = {
  formAction: (formData: FormData) => void;
  txtAreaTextRef: React.RefObject<HTMLTextAreaElement>;
  media: File | null;
  onUploadMedia: (uploadMedia: File) => void;
  onRemoveMedia: () => void;
  buttonText: string;
  submitting: boolean;
  txtAreaPlaceholder: string;
  txtAreaName: string;
};

const CustomTextArea = ({
  formAction,
  txtAreaTextRef,
  media,
  onUploadMedia,
  onRemoveMedia,
  buttonText,
  submitting,
  txtAreaPlaceholder,
  txtAreaName,
}: CustomTextAreaProps) => {
  const txtAreaMaxLength = 280;
  const characterLimit = 350;
  const maxTextAreaHeight = 300;
  const [remainingChars, setRemainingChars] = useState(txtAreaMaxLength);
  const [uploading, setUploading] = useState(false);

  const isButtonDisabled =
    submitting ||
    (!txtAreaTextRef.current?.value.length && !media) ||
    remainingChars < 0;

  const countCharacters = () => {
    setRemainingChars(txtAreaMaxLength - txtAreaTextRef.current!.value.length);
  };

  useEffect(() => {
    txtAreaTextRef.current!.addEventListener("input", countCharacters);

    return () => {
      if (txtAreaTextRef.current) {
        txtAreaTextRef.current.removeEventListener("input", countCharacters);
      }
    };
  }, [txtAreaTextRef.current?.value.length]);

  const handleChange = () => {
    if (txtAreaTextRef.current) {
      txtAreaTextRef.current.style.height = "auto";
      txtAreaTextRef.current.style.height = `${Math.min(
        txtAreaTextRef.current.scrollHeight,
        maxTextAreaHeight
      )}px`;
    }
  };

  const uploadMedia: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    setUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      setUploading(false);
      return;
    }

    const selectedMedia = event.target.files[0];
    onUploadMedia(selectedMedia);
    setUploading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(txtAreaName, txtAreaTextRef.current!.value);
    if (media) {
      formData.append("media", media);
    }

    setRemainingChars(txtAreaMaxLength); // reset remainingChars

    formAction(formData);
  };

  return (
    <form
      // action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col w-full px-2 pt-2"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-col border-b">
          <textarea
            ref={txtAreaTextRef}
            onChange={handleChange}
            maxLength={characterLimit}
            name={txtAreaName}
            className="bg-transparent no-scrollbar border-none outline-none resize-none pt-2"
            placeholder={txtAreaPlaceholder}
          />
          {media && (
            <div className="my-4 relative">
              <div
                onClick={() => onRemoveMedia()}
                className="absolute right-2 top-2 w-fit p-2 bg-slate-700 hover:bg-opacity-90 rounded-full cursor-pointer"
              >
                <VscClose size={20} />
              </div>
              {media.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Media Preview"
                  className="w-full h-auto"
                />
              ) : media.type.startsWith("video/") ? (
                <video controls>
                  <source src={URL.createObjectURL(media)} type={media.type} />
                </video>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between mt-4">
          <label
            htmlFor="addMedia"
            className="my-auto p-2 hover:bg-blue-500/20 rounded-full transition ease-out text-blue-500 cursor-pointer"
          >
            <GoFileMedia size={20} />
            <input
              type="file"
              id="addMedia"
              name="media"
              className="hidden absolute"
              accept="image/* video/mp4"
              onChange={uploadMedia}
              disabled={uploading}
            />
          </label>

          <div className="flex">
            {remainingChars <= 20 && remainingChars > 0 ? (
              <p className="py-2 px-4 text-yellow-500">{remainingChars}</p>
            ) : (
              remainingChars <= 0 && (
                <p className="py-2 px-4 text-red-500">{remainingChars}</p>
              )
            )}

            <button
              disabled={isButtonDisabled}
              type="submit"
              className={`${
                isButtonDisabled
                  ? "bg-opacity-50 text-foreground/50"
                  : "hover:bg-opacity-80 transition ease-in-out"
              } rounded-full bg-blue-500 py-2 px-4`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CustomTextArea;
