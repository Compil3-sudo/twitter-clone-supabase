"use client";

import { createContext, useState } from "react";

export type ComposeTweetModalContextType = {
  showComposeTweetModal: boolean;
  changeComposeModal: (status: boolean) => void;
};

export const ComposeTweetModalContext =
  createContext<ComposeTweetModalContextType | null>(null);

const ComposeTweetModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showComposeTweetModal, setShowComposeTweetModal] = useState(false);

  const changeComposeModal = (status: boolean) => {
    setShowComposeTweetModal(status);
  };

  return (
    <ComposeTweetModalContext.Provider
      value={{
        showComposeTweetModal,
        changeComposeModal,
      }}
    >
      {children}
    </ComposeTweetModalContext.Provider>
  );
};

export default ComposeTweetModalProvider;
