"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { BsThreeDots, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { FaFeatherAlt } from "react-icons/fa";
import {
  BiHomeCircle,
  BiSolidHomeCircle,
  BiSearch,
  BiSolidSearch,
  BiMessageSquareDetail,
  BiSolidMessageSquareDetail,
} from "react-icons/bi";
import { IoIosNotificationsOutline, IoIosNotifications } from "react-icons/io";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import Logo from "public/static/rares_favicon-light-32x32.png";
import { useContext, useEffect, useState } from "react";
import Logout from "@/app/(authenticate)/auth/sign-out/Logout";
import { usePathname } from "next/navigation";
import Modal from "./client-components/Modal";
import { VscClose } from "react-icons/vsc";
import {
  ComposeTweetModalContext,
  ComposeTweetModalContextType,
} from "./context/ComposeTweetModalContext";

type NavigationItem = {
  text: string;
  icon: React.ReactNode;
  iconFill: React.ReactNode;
  logo?: StaticImageData;
};

const LeftSidebar = ({
  user,
  ComposeTweet,
}: {
  user: Profile;
  ComposeTweet: JSX.Element;
}) => {
  const path = usePathname();
  const [activeNav, setActiveNav] = useState(
    path.split("/")[1].toLocaleLowerCase()
  );
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [windowSize, setWindowSize] = useState(0);

  const { showComposeTweetModal, changeComposeModal } = useContext(
    ComposeTweetModalContext
  ) as ComposeTweetModalContextType;

  const navigationTabs = [
    "home",
    "explore",
    "notifications",
    "messages",
    "bookmarks",
    user.username.toLocaleLowerCase(),
  ];

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

  useEffect(() => {
    const navigationTab = path.split("/")[1].toLocaleLowerCase();
    if (!navigationTabs.includes(navigationTab)) {
      setActiveNav("");
    } else {
      setActiveNav(navigationTab);
    }
    setShowSidebar(false);
  }, [path]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(window.innerWidth);
    }

    if (windowSize > 640) {
      setShowSidebar(false);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);

  return (
    <>
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="sm:hidden fixed top-3/4 z-30 ml-2 p-2 rounded-full bg-blue-500 hover:bg-opacity-80 transition ease-in-out"
      >
        {showSidebar ? (
          <TbLayoutSidebarLeftCollapseFilled size={25} />
        ) : (
          <TbLayoutSidebarLeftExpandFilled size={25} />
        )}
      </button>

      <div
        className={`${
          showSidebar ? "fixed grid z-20" : "max-sm:hidden"
        } flex flex-col max-xl:ml-[140px] xl:flex-grow xl:max-w-xl items-end`}
      >
        <div
          className={`${
            showSidebar ? "left-0 pl-10 bg-slate-950 w-full" : ""
          } top-0 fixed flex flex-col h-full justify-between px-2`}
        >
          <div className="flex flex-col text-xl">
            <div className="flex flex-col items-end xl:items-start m-4 space-y-4">
              {navigationList.map((item) => (
                <Link
                  key={item.text}
                  className="w-full"
                  href={`/${
                    item.text === ""
                      ? "home"
                      : item.text === "Profile"
                      ? user.username
                      : item.text.toLowerCase()
                  }`}
                >
                  <div className="w-fit px-4 py-2 rounded-full hover:bg-white/20 transition duration-200">
                    {item.logo && (
                      <Image
                        src={item.logo.src}
                        width={32}
                        height={32}
                        alt="RT Logo"
                      />
                    )}

                    <div className="flex items-center">
                      <div>
                        {item.text === "Profile"
                          ? user.username.toLocaleLowerCase() ===
                            activeNav.toLocaleLowerCase()
                            ? item.iconFill
                            : item.icon
                          : item.text.toLocaleLowerCase() ===
                            activeNav.toLocaleLowerCase()
                          ? item.iconFill
                          : item.icon}
                      </div>
                      <div
                        className={`${
                          showSidebar ? "" : "hidden"
                        } xl:flex xl:items-center px-2`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              <button
                onClick={() => {
                  changeComposeModal(true);
                }}
                className="max-xl:hidden rounded-full p-2 w-full bg-blue-500 hover:bg-opacity-80 transition duration-200"
              >
                Post
              </button>

              {/* different post button for smaller view */}
              {showComposeTweetModal && (
                <Modal onClose={() => changeComposeModal(false)}>
                  <div className="flex flex-col bg-slate-950 rounded-3xl px-2 py-4 sm:w-[600px] w-[300px]">
                    <div
                      onClick={() => changeComposeModal(false)}
                      className="p-1 mx-4 rounded-full w-fit cursor-pointer text-gray-300 hover:bg-gray-500"
                    >
                      <VscClose size={25} />
                    </div>
                    {ComposeTweet}
                  </div>
                </Modal>
              )}
              <div className="w-full">
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    changeComposeModal(true);
                  }}
                  className="xl:hidden w-fit px-3 py-2"
                >
                  <div className="rounded-full bg-blue-500 p-2 hover:bg-opacity-80 transition duration-200">
                    <FaFeatherAlt size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-2 self-start max-xl:mx-4">
            {showProfileOptions && (
              <div className="absolute -mt-12 bg-slate-950 self-center m-2 border rounded-xl shadow-sm shadow-white">
                <Logout />
              </div>
            )}
            <div
              onClick={() => setShowProfileOptions(!showProfileOptions)}
              className="self-center cursor-pointer rounded-full w-fit hover:bg-white/20 p-2 mb-3"
            >
              <div className="grid gap-2 grid-flow-col items-center">
                <Image
                  src={user.avatar_url}
                  height={40}
                  width={40}
                  alt="Profile Image"
                  className="rounded-full"
                />
                <div className="hidden xl:flex flex-col">
                  <h2 className="">{user.name}</h2>
                  <h2 className="text-gray-500">@{user.username}</h2>
                </div>
                <div className="max-xl:hidden items-center pl-8 pr-1">
                  <BsThreeDots />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
