import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebarServer from "@/components/server-components/LeftSidebarServer";
import ComposeTweetModalProvider from "@/components/context/ComposeTweetModalContext";
import ComposeReplyModalProvider from "@/components/context/ComposeReplyModalContext";
import SearchModalProvider from "@/components/context/SearchModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter - Clone",
  description: "Twitter clone by Compil3",
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
        <div id="overlays"></div>

        <div className="flex">
          <SearchModalProvider>
            <ComposeTweetModalProvider>
              <ComposeReplyModalProvider>
                <LeftSidebarServer />

                <main className="flex flex-col max-w-[600px] w-full h-full min-h-screen mx-2 border-l border-r">
                  {children}
                </main>
              </ComposeReplyModalProvider>
            </ComposeTweetModalProvider>
            <RightSidebar />
          </SearchModalProvider>
        </div>
      </body>
    </html>
  );
}
