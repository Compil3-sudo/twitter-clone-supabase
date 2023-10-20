import ArrowHeader from "@/components/client-components/ArrowHeader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Connect = () => {
  // TODO: OPTIONAL - nice feature add tabs for follow anyone? & follow for you with custom suggestions for auth user?
  const supabase = createClientComponentClient();

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  const test = supabase.auth.getUser().then((response) => response.data);
  console.log(test);

  const user = getCurrentUser();

  console.log(user);

  return (
    <>
      <ArrowHeader title="Connect" />
      <h1 className="text-xl p-4 font-bold">Who to follow</h1>
    </>
  );
};

export default Connect;
