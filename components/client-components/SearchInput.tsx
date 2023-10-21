"use client";

import { useContext, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import {
  SearchModalContext,
  SearchModalContextType,
} from "../context/SearchModalContext";
import Modal from "./Modal";
import { VscClose } from "react-icons/vsc";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>(
    [] as Profile[]
  );
  const { showSearchModal, changeShowModal } = useContext(
    SearchModalContext
  ) as SearchModalContextType;

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (searchTerm !== "") {
      const timer = setTimeout(async () => {
        changeShowModal(true);
        // Fetch search results based on searchTerm
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("name", `%${searchTerm}%`);
        // .ilike("username", `%${searchTerm}%`);
        // .filter("name", "ilike", `%${searchTerm}%`)
        // .filter("name", .ilike.%${searchTerm}%")
        // .or(`name.ilike.%${searchTerm}%`)
        // .or(`username.ilike.%${searchTerm}%`);

        if (data) {
          setSearchResults(data);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  return (
    <>
      {showSearchModal && (
        <Modal onClose={() => changeShowModal(false)}>
          <div className="flex flex-col bg-slate-950 rounded-3xl px-2 py-4 sm:w-[600px] w-[300px]">
            <div
              onClick={() => changeShowModal(false)}
              className="p-1 mx-4 rounded-full w-fit cursor-pointer text-gray-300 hover:bg-gray-500"
            >
              <VscClose size={25} />
            </div>
            <section className="flex flex-col p-4">
              <h1 className="mb-4">
                Search results based on search term: {searchTerm}
              </h1>
              {searchResults.map((profile) => (
                <h2 key={profile.id}>
                  {profile.name} @{profile.username}
                </h2>
              ))}
            </section>
          </div>
        </Modal>
      )}
      <div className="group flex bg-[#16181C] rounded-full p-2 px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
        <BiSearch className="group-focus-within:text-blue-500" />
        <input
          onChange={(e) => {
            setSearchTerm(e.target.value);
            changeShowModal(false);
          }}
          type="text"
          placeholder="Search"
          className="bg-[#16181C] outline-none focus:bg-slate-950"
        />
      </div>
    </>
  );
};

export default SearchInput;
