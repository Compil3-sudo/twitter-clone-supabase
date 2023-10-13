import Image from "next/image";
import Logo from "public/static/android-chrome-192x192.png";
import CreateAccountForm from "./CreateAccountForm";

export const dynamic = "force-dynamic";

const CreateAccount = () => {
  return (
    <div className="grid grid-flow-col h-screen place-items-center">
      <div className="flex flex-col justify-center">
        <div className="self-center p-6">
          <h1 className="text-3xl font-bold py-2">Twitter Clone by Compil3</h1>
          <h2 className="text-xl">Frameworks and tools:</h2>
          <ul className="px-6">
            <li>NextJs (Version 13.5.3 with App Router)</li>
            <li>Supabase (PostgreSQL DB, Authentication, Storage)</li>
            <li>React</li>
            <li>TailwindCSS</li>
          </ul>
          <div className="flex justify-center mt-5">
            <Image src={Logo} width={192} height={192} alt="Logo" />
          </div>
        </div>
      </div>
      <CreateAccountForm />
    </div>
  );
};

export default CreateAccount;
