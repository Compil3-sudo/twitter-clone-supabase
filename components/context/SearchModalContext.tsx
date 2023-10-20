"use client";

import { createContext, useState } from "react";

export type SearchModalContextType = {
  showSearchModal: boolean;
  changeShowModal: (status: boolean) => void;
};

export const SearchModalContext = createContext<SearchModalContextType | null>(
  null
);

const SearchModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const changeShowModal = (status: boolean) => {
    setShowSearchModal(status);
  };

  return (
    <SearchModalContext.Provider
      value={{
        showSearchModal,
        changeShowModal,
      }}
    >
      {children}
    </SearchModalContext.Provider>
  );
};

export default SearchModalProvider;
