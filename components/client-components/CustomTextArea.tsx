"use client";

import React, { useEffect, useRef, useState } from "react";

type CustomTextAreaProps = {
  formAction: (formData: FormData) => void;
  txtAreaTextRef: React.RefObject<HTMLTextAreaElement>;
  buttonText: string;
  txtAreaPlaceholder: string;
  txtAreaName: string;
};

const CustomTextArea = ({
  formAction,
  txtAreaTextRef,
  buttonText,
  txtAreaPlaceholder,
  txtAreaName,
}: CustomTextAreaProps) => {
  // const txtAreaTextRef = useRef<HTMLTextAreaElement>(null);
  const txtAreaMaxLength = 280;
  const characterLimit = 350;
  const maxTextAreaHeight = 300;
  const [remainingChars, setRemainingChars] = useState(txtAreaMaxLength);
  const [remainingCharsColor, setRemainingCharsColor] = useState("yellow");

  const countCharacters = () => {
    setRemainingChars(txtAreaMaxLength - txtAreaTextRef.current!.value.length);
  };

  useEffect(() => {
    txtAreaTextRef.current!.addEventListener("input", countCharacters);

    if (remainingChars <= 0) {
      setRemainingCharsColor("red-500");
    } else if (remainingChars >= 1 && remainingChars <= 20) {
      setRemainingCharsColor("yellow-500");
    }

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

  return (
    <form
      action={formAction}
      className="flex flex-col w-full flex-grow px-2 pt-2"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-col border-b">
          <textarea
            ref={txtAreaTextRef}
            onChange={handleChange}
            maxLength={characterLimit}
            name={txtAreaName}
            // add invisible scrollbar
            className="bg-transparent border-none outline-none resize-none pt-2"
            placeholder={txtAreaPlaceholder}
          />
        </div>

        <div className="flex flex-col items-end mt-4">
          <div className="flex">
            {remainingChars <= 20 && (
              <p className={`py-2 px-4 text-${remainingCharsColor}`}>
                {remainingChars}
              </p>
            )}

            <button
              type="submit"
              className="rounded-full bg-blue-500 py-2 px-4"
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
