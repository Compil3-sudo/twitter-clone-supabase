import supabaseClient from "@/app/utils/supabaseClient";

export default async function getAllUsers() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("username");

  if (error) throw new Error(`Failed to fetch all users: ${error}`);

  return data;
}
