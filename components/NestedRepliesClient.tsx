"use client";

import { useState } from "react";

type Reply = {
  id: string;
  text: string;
};

type NestedRepliesClientProps = {
  replies: Reply[];
};

const NestedRepliesClient = ({ replies }: any) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <>
      {showReplies ? (
        replies.map((reply: any) => (
          <div key={reply.id} className="px-8">
            {reply.text}
          </div>
        ))
      ) : (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-blue-500"
        >
          Show replies
        </button>
      )}
    </>
  );
};

export default NestedRepliesClient;
