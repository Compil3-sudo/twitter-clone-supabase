"use client";

import Link from "next/link";
import SuggestedProfile from "./SuggestedProfile";
import { usePathname } from "next/navigation";

type SuggestProfilesPanelProps = {
  followProfiles:
    | {
        id: string;
        username: string;
        name: string;
        bio: string;
        avatar_url: string;
      }[]
    | null;
  userId: Profile["id"];
};

const SuggestProfilesPanel = ({
  followProfiles,
  userId,
}: SuggestProfilesPanelProps) => {
  const path = usePathname();

  if (path.startsWith("/connect")) {
    return;
  }

  return (
    <div className="flex flex-col bg-[#16181C] rounded-xl pt-2 mt-16">
      <h2 className="p-2 text-lg font-bold">Who to Follow</h2>
      {followProfiles?.map((followProfile) => (
        <SuggestedProfile
          key={followProfile.id}
          userId={userId}
          suggestedProfile={followProfile}
          isUserFollowingProfile={false}
        />
      ))}
      <Link
        href={"/connect"}
        className="rounded-b-xl text-sky-500 hover:bg-white/10 transition duration-200 px-2 py-4"
      >
        Show more
      </Link>
    </div>
  );
};

export default SuggestProfilesPanel;
