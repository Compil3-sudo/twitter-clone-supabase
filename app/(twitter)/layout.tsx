import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebarServer from "@/components/server-components/LeftSidebarServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter - Clone",
  description: "Twitter tutorial from freecodecamp",
  icons: {
    icon: [
      {
        url: "/static/rares_favicon-light-16x16.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/static/rares_favicon-dark-16x16.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
    ],
  },
};

export default function TwitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen h-full bg-slate-950 text-foreground`}
      >
        <div className="flex">
          <LeftSidebarServer />
          <main className="flex flex-col max-w-[600px] w-full h-full min-h-screen mx-2 border-l border-r">
            {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  );
}
