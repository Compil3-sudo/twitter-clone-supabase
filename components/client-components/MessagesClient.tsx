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
  usersConversationDictionary,
  createNewChat,
}: {
  userId: Profile["id"];
  chatParticipants: Profile[] | null;
  usersConversationDictionary: Record<string, string>;
  createNewChat: (id: Profile["id"]) => void;
}) => {
  const router = useRouter();

  const navigateToChat = (chatParticipantId: Profile["id"]) => {
    const conversationId = usersConversationDictionary[chatParticipantId];

    router.push(`/messages/${conversationId}`);
  };

  const createNewChatServer = async (id: Profile["id"]) => {
    try {
      await createNewChat(id);
    } catch (error) {
      console.log(error);
    }
  };

  // IF profile in chatParticipants => navigate to chat (has different icon), ELSE create NEW chat with profile
  const chatFunction = (id: Profile["id"]) => {
    if (usersConversationDictionary[id]) {
      navigateToChat(id);
    } else {
      // TODO: OPTIONAL: conversations type: direct_message OR group_chat
      createNewChatServer(id);
    }
  };

  const getChatIcon = (id: Profile["id"]) => {
    if (usersConversationDictionary[id]) {
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
            onClickFunction={() => navigateToChat(participant.id)}
          />
        ))
      ) : (
        <h1 className="text-xl p-2">You currently don't have any chats</h1>
      )}
    </>
  );
};

export default MessagesClient;
