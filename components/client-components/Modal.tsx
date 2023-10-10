"use client";

import { ReactNode } from "react";
import ReactDOM from "react-dom";

const Backdrop = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed top-0 left-0 min-w-screen w-full min-h-screen h-full z-20 bg-gray-700 bg-opacity-80"
      onClick={onClose}
    />
  );
};

const ModalOverlay = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      {children}
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
