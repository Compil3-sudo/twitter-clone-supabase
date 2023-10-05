import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const username = String(formData.get("username"));
  const name = String(formData.get("name"));
  const password = String(formData.get("password"));
  const supabase = createRouteHandlerClient({ cookies });

  // IMPORTANT: TODO: do NOT allow users to try to sign-up with email, when they already signed-up with github
  // ^ why does this not throw an error ?

  const default_avatar_url =
    "https://tkucuunzwysyuqynjhwt.supabase.co/storage/v1/object/public/avatars/twitter_default_avatar.png";

  // async function downloadImage() {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from("avatars")
  //       .getPublicUrl();
  //     if (error) {
  //       throw error;
  //     }
  //     const default_avatar_url = URL.createObjectURL(data);
  //     return default_avatar_url;
  //   } catch (error: any) {
  //     console.log("Error downloading image: ", error.message);
  //   }
  // }

  // const default_avatar_url = await downloadImage();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        user_name: username,
        name: name,
        avatar_url: default_avatar_url,
      },
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}
