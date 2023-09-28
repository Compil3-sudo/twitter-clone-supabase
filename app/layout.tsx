import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-foreground`}>
        {children}
      </body>
    </html>
  );
}
