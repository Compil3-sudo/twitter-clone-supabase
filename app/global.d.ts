import { Database as DB } from "@/lib/database.types";

type Tweet = DB["public"]["Tables"]["tweets"]["Row"];

declare global {
  type Database = DB;
  type Profile = DB["public"]["Tables"]["profiles"]["Row"];
  type TweetWithAuthor = Tweet & {
    author: Profile;
    user_has_liked: boolean;
    likes: number;
    replies: number;
  };
  type Message = DB["public"]["Tables"]["messages"]["Row"];
}
