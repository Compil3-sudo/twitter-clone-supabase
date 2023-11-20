"use client";

import SearchInput from "./SearchInput";
import {
  BiMessageSquareDetail,
  BiSolidMessageSquareDetail,
} from "react-icons/bi";
import SuggestedProfile from "./SuggestedProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";

const MessagesClient = ({
  userId,
  chatParticipants,
  usersConversationDictionary,
}: {
  userId: Profile["id"];
  chatParticipants: Profile[] | null;
  usersConversationDictionary: Record<string, string>;
}) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const navigateToChat = (chatParticipantId: Profile["id"]) => {
    const conversationId = usersConversationDictionary[chatParticipantId];

    router.push(`/messages/${conversationId}`);
  };

  const createNewChat = async (participantId: Profile["id"]) => {
    try {
      // create a conversationId in conversations with type: direct_message (one-to-one chat)
      const conversationId = uuidv4();
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({ id: conversationId, type: "direct_message" });

      // add current user and selected participant to chat
      const { data: addCurrentUser, error: addCurrentUserError } =
        await supabase
          .from("user_conversations")
          .insert({ user_id: userId, conversation_id: conversationId });

      const { data: addParticipant, error: addParticipantError } =
        await supabase
          .from("user_conversations")
          .insert({ user_id: participantId, conversation_id: conversationId });

      router.refresh();

      if (conversationError) throw conversationError;
      if (addCurrentUserError) throw addCurrentUserError;
      if (addParticipantError) throw addParticipantError;

      router.push(`/messages/${conversationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // IF profile in chatParticipants => navigate to chat (has different icon), ELSE create NEW chat with profile & then navigate to it
  const chatFunction = (participantId: Profile["id"]) => {
    if (usersConversationDictionary[participantId]) {
      navigateToChat(participantId);
    } else {
      createNewChat(participantId);
    }
  };

  const getChatIcon = (id: Profile["id"]) => {
    if (usersConversationDictionary[id]) {
      return <BiSolidMessageSquareDetail size={25} />;
    } else {
      return <BiMessageSquareDetail size={25} />;
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("realtime user_conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_conversations",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

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
