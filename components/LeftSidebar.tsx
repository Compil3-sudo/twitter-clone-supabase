"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { BsThreeDots, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa6";
import {
  BiHomeCircle,
  BiSolidHomeCircle,
  BiSearch,
  BiSolidSearch,
  BiMessageSquareDetail,
  BiSolidMessageSquareDetail,
} from "react-icons/bi";
import { IoIosNotificationsOutline, IoIosNotifications } from "react-icons/io";
import Logo from "public/static/rares_favicon-light-32x32.png";
import Logout from "@/app/auth/sign-out/Logout";
import { useState } from "react";

type NavigationItem = {
  text: string;
  icon: React.ReactNode;
  iconFill: React.ReactNode;
  logo?: StaticImageData;
};

const LeftSidebar = ({ user }: any) => {
  const [activeNav, setActiveNav] = useState("Home");

  const navigationList: NavigationItem[] = [
    {
      text: "",
      icon: null,
      iconFill: null,
      logo: Logo,
    },
    {
      text: "Home",
      icon: <BiHomeCircle size={25} />,
      iconFill: <BiSolidHomeCircle size={25} />,
    },
    {
      text: "Explore",
      icon: <BiSearch size={25} />,
      iconFill: <BiSolidSearch size={25} />,
    },
    {
      text: "Notifications",
      icon: <IoIosNotificationsOutline size={25} />,
      iconFill: <IoIosNotifications size={25} />,
    },
    {
      text: "Messages",
      icon: <BiMessageSquareDetail size={25} />,
      iconFill: <BiSolidMessageSquareDetail size={25} />,
    },
    // idk what this does
    // {
    //   text: "Lists ?",
    //   icon: null,
    // },
    {
      text: "Bookmarks",
      icon: <BsBookmark size={25} />,
      iconFill: <BsBookmarkFill size={25} />,
    },
    // idk what this does
    // {
    //   text: "Communities ?",
    //   icon: null,
    // },
    {
      text: "Profile",
      icon: <FaRegUser size={25} />,
      iconFill: <FaUser size={25} />,
    },
  ];

  return (
    <div className="flex flex-col max-w-xl flex-grow items-end">
      <div className="top-0 fixed flex flex-col h-full justify-between px-2">
        <div className="flex flex-col text-xl">
          <div className="flex flex-col items-start my-4 mx-4 space-y-4">
            {navigationList.map((item) => (
              <div
                key={item.text}
                onClick={() =>
                  item.text === ""
                    ? setActiveNav("Home") // if you click on Logo => activate Home
                    : setActiveNav(item.text)
                }
                className="px-4 py-2 rounded-full hover:bg-white/20 transition duration-200"
              >
                {item.logo && (
                  <Link href={"/home"}>
                    <img src={item.logo.src} />
                  </Link>
                )}

                <Link
                  href={`/${
                    item.text === "Profile"
                      ? user.user_metadata.user_name
                      : item.text.toLowerCase()
                  }`}
                >
                  <div className="flex items-center">
                    <div>
                      {item.text === activeNav ? item.iconFill : item.icon}
                    </div>
                    <div className="px-2">{item.text}</div>
                  </div>
                </Link>
              </div>
            ))}
            <button className="rounded-full p-2 w-full bg-blue-500">
              Post
            </button>
          </div>
        </div>
        <div className="self-center mb-2">
          <Logout />
          <div className="rounded-full hover:bg-white/20 p-2 mb-3">
            <div className="grid gap-2 grid-flow-col items-center">
              <Image
                src={user.user_metadata.avatar_url}
                height={40}
                width={40}
                alt="Profile Image"
                className="rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="">{user.user_metadata.name}</h2>
                <h2 className="text-gray-500">
                  @{user.user_metadata.user_name}
                </h2>
              </div>
              <div className="items-center pl-8 pr-1">
                <BsThreeDots />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
