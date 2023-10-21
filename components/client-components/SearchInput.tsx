"use client";

import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const SearchInput = ({ currentUserId }: { currentUserId: Profile["id"] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>(
    [] as Profile[]
  );

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (searchTerm !== "") {
      const timer = setTimeout(async () => {
        // Fetch search results based on searchTerm
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUserId)
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
      <div className="relative group flex bg-[#16181C] rounded-full p-2 px-4 items-center space-x-3 border focus-within:bg-slate-950 focus-within:border-blue-500">
        <BiSearch className="group-focus-within:text-blue-500" />
        <input
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search"
          className="bg-[#16181C] outline-none focus:bg-slate-950"
        />
        {/* NEED TO DIFFERENTIATE BETWEEN SEARCH TO START CONVERSATION AND SERCH TO NAVIGATE TO PROFILE */}

        {searchTerm && (
          // <div className="fixed top-16 z-10 bg-slate-950 py-2 flex flex-col max-w-[350px] w-full">
          <div className="absolute z-10 right-0 top-0 flex flex-col mt-12 bg-slate-950 border rounded-lg shadow-sm shadow-white/50 max-w-[350px] w-full">
            {searchResults.map((profile) => (
              <div
                key={profile.id}
                // onClick={} // CREATE NEW conversation with user. If conversation already exists => navigate to conversation
                className="flex space-x-3 p-2 w-full justify-center hover:bg-white/10 transition duration-200 cursor-pointer"
              >
                <div className="flex-none overflow-hidden w-10 h-10 my-auto">
                  <div className="w-full h-full relative">
                    <Image
                      src={profile.avatar_url}
                      fill
                      className="rounded-full object-cover"
                      alt="Profile Image"
                    />
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <div className="flex flex-col w-full">
                    <div className="flex w-full">
                      <div className="flex flex-col w-full">
                        <h2>{profile.name}</h2>
                        <h2 className="text-gray-500 text-sm">
                          @{profile.username}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchInput;
