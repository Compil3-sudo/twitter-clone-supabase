"use client";

import { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SuggestedProfile from "./SuggestedProfile";

type SearchInputProps = {
  currentUserId: Profile["id"];
  chatFunction?: (id: Profile["id"]) => void;
  getIcon?: (id: Profile["id"]) => JSX.Element;
};

const SearchInput = ({
  currentUserId,
  chatFunction,
  getIcon,
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>(
    [] as Profile[]
  );
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const supabase = createClientComponentClient<Database>();

  // Close the menu when clicking outside of the search input
  useEffect(() => {
    const closeMenuOnOutsideClick = (e: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSearchMenu(false);
      }
    };

    document.addEventListener("click", closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeMenuOnOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      const timer = setTimeout(async () => {
        // Fetch search results based on searchTerm
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUserId)
          .or(`name.ilike.%${searchTerm}%, username.ilike.%${searchTerm}%`);

        if (data) {
          setSearchResults(data);
          setShowSearchMenu(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  let content;

  if (searchTerm === "") {
    content = showSearchMenu && (
      <div className="absolute z-10 right-0 top-0 flex flex-col max-h-[60vh] h-auto overflow-auto mt-12 bg-slate-950 border rounded-lg shadow-sm shadow-white/50 max-w-[350px] w-full">
        <h2 className="text-center my-4">Search for people</h2>
      </div>
    );
  } else if (getIcon && chatFunction) {
    // IF profile in chatParticipants => navigate to chat (has different icon), ELSE create NEW chat with profile
    // display chat icon
    content = showSearchMenu && (
      <div className="absolute z-10 right-0 top-0 flex flex-col max-h-[60vh] h-auto overflow-auto mt-12 bg-slate-950 border rounded-lg shadow-sm shadow-white/50 max-w-[350px] w-full">
        {searchResults.length > 0 ? (
          searchResults.map((profile) => (
            <SuggestedProfile
              key={profile.id}
              userId={currentUserId}
              suggestedProfile={profile}
              onClickFunction={() => chatFunction(profile.id)}
              icon={getIcon(profile.id)}
            />
          ))
        ) : (
          <h1>No results found.</h1>
        )}
      </div>
    );
  } else {
    // navigate to profile on click
    content = showSearchMenu && (
      <div className="absolute z-10 right-0 top-0 flex flex-col max-h-[60vh] h-auto overflow-auto mt-12 bg-slate-950 border rounded-lg shadow-sm shadow-white/50 max-w-[350px] w-full">
        {searchResults.length > 0 ? (
          searchResults.map((profile) => (
            <SuggestedProfile
              key={profile.id}
              userId={currentUserId}
              suggestedProfile={profile}
            />
          ))
        ) : (
          <h1>No results found.</h1>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="relative group flex bg-[#16181C] rounded-full p-2 px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
        <BiSearch className="group-focus-within:text-blue-500" />

        <input
          ref={searchInputRef}
          onClick={() => {
            // Show the menu when the input is clicked & it has results
            if (searchResults.length > 0) {
              setShowSearchMenu(true);
            }
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search"
          className="bg-[#16181C] outline-none focus:bg-slate-950"
        />

        {content}
      </div>
    </>
  );
};

export default SearchInput;
