"use client";

import { useState } from "react";

type Reply = {
  id: string;
  parent_reply_id: string | null;
  text: string;
  tweet_id: string;
  user_id: string;
  nestedReplies: Reply | null;
};

type NestedRepliesClientProps = {
  replies: Reply[] | null;
};

const NestedRepliesClient = ({ replies }: any) => {
  const [showReplies, setShowReplies] = useState(replies.length > 0);

  return (
    <>
      {showReplies ? (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-blue-500"
        >
          Show replies
        </button>
      ) : (
        replies.map((reply: any) => (
          <div key={reply.id} className="px-8">
            {reply.text}
          </div>
        ))
      )}
    </>
  );
};

export default NestedRepliesClient;
