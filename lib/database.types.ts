export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          tweet_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          tweet_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          tweet_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_tweet_id_fkey";
            columns: ["tweet_id"];
            referencedRelation: "tweets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      followers: {
        Row: {
          followed_id: string;
          follower_id: string;
        };
        Insert: {
          followed_id: string;
          follower_id: string;
        };
        Update: {
          followed_id?: string;
          follower_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "followers_followed_id_fkey";
            columns: ["followed_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "followers_follower_id_fkey";
            columns: ["follower_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      hashtags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          created_at: string;
          id: string;
          tweet_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tweet_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tweet_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_tweet_id_fkey";
            columns: ["tweet_id"];
            referencedRelation: "tweets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string;
          bio: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          username: string;
        };
        Insert: {
          avatar_url: string;
          bio?: string | null;
          created_at?: string;
          email: string;
          id: string;
          name: string;
          username: string;
        };
        Update: {
          avatar_url?: string;
          bio?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      replies: {
        Row: {
          id: string;
          parent_reply_id: string | null;
          text: string;
          tweet_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          parent_reply_id?: string | null;
          text: string;
          tweet_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          parent_reply_id?: string | null;
          text?: string;
          tweet_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "replies_parent_reply_id_fkey";
            columns: ["parent_reply_id"];
            referencedRelation: "replies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "replies_tweet_id_fkey";
            columns: ["tweet_id"];
            referencedRelation: "tweets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "replies_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tweet_hashtag: {
        Row: {
          hashtag_id: string;
          tweet_id: string;
        };
        Insert: {
          hashtag_id: string;
          tweet_id: string;
        };
        Update: {
          hashtag_id?: string;
          tweet_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tweet_hashtag_hashtag_id_fkey";
            columns: ["hashtag_id"];
            referencedRelation: "hashtags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tweet_hashtag_tweet_id_fkey";
            columns: ["tweet_id"];
            referencedRelation: "tweets";
            referencedColumns: ["id"];
          }
        ];
      };
      tweets: {
        Row: {
          created_at: string;
          id: string;
          text: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          text: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          text?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tweets_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_profiles_to_follow: {
        Args: {
          authenticated_user_id: string;
        };
        Returns: {
          id: string;
          username: string;
          name: string;
          avatar_url: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
