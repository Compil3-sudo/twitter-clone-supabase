"use client";

import Image from "next/image";
import { ReactNode } from "react";
import ReactDOM from "react-dom";
import Logo from "public/static/rares_favicon-light-32x32.png";

const Backdrop = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-20 bg-gray-700 bg-opacity-80"
      onClick={onClose}
    />
  );
};

const ModalOverlay = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="bg-slate-950 rounded-2xl py-4 px-10 flex flex-col">
        <Image
          src={Logo}
          width={32}
          height={32}
          alt="RT Logo"
          className="mb-5 self-center"
        />
        {children}
      </div>
    </div>
  );
};

let portalElement: HTMLElement;

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
  portalElement = document.getElementById("overlays")!;
}

const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
