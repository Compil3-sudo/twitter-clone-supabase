"use client";

import SearchInput from "./SearchInput";
import {
  BiMessageSquareDetail,
  BiSolidMessageSquareDetail,
} from "react-icons/bi";
import SuggestedProfile from "./SuggestedProfile";
import { useRouter } from "next/navigation";

const MessagesClient = ({
  userId,
  chatParticipants,
  chatParticipantIds,
}: {
  userId: Profile["id"];
  chatParticipants: Profile[] | null;
  chatParticipantIds: Profile["id"][] | null;
}) => {
  const router = useRouter();

  // IF profile in chatParticipants => navigate to chat (has different icon), ELSE create NEW chat with profile
  const chatFunction = (id: Profile["id"]) => {
    if (chatParticipantIds?.includes(id)) {
      console.log("navigate to chat");
      //  router.push("/")
    } else {
      console.log("create a new chat");
    }
  };

  const getChatIcon = (id: Profile["id"]) => {
    if (chatParticipantIds?.includes(id)) {
      return <BiSolidMessageSquareDetail size={25} />;
    } else {
      return <BiMessageSquareDetail size={25} />;
    }
  };

  return (
    <>
      <div className="flex mx-4 my-2">
        <SearchInput
          currentUserId={userId}
          chatFunction={chatFunction}
          getIcon={getChatIcon}
        />
      </div>
      {chatParticipants ? (
        chatParticipants.map((participant) => (
          <SuggestedProfile
            key={participant.id}
            userId={userId}
            suggestedProfile={participant}
            // need client component here to pass onClick function
            // navigate to conversation with messages. /messages/chatParticipantId ?
            onClickFunction={() => console.log("potato")}
          />
        ))
      ) : (
        <h1 className="text-xl p-2">You currently don't have any chats</h1>
      )}
    </>
  );
};

export default MessagesClient;
