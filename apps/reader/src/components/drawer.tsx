"use client";
// https://letsbuildui.dev/articles/building-a-drawer-component-with-react-portals

import { useRef, useEffect } from "react";
import { cn } from "./shadcn-ui/utils";
import "src/styles/drawer.css";
import { createPortal } from "react-dom";
import useMountTransition from "./use-mount-transition";

function createPortalRoot() {
  const drawerRoot = document.createElement("div");
  drawerRoot.setAttribute("id", "drawer-root");

  return drawerRoot;
}

type Props = {
  isOpen: boolean;
  children: any;
  className?: string;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  removeWhenClosed?: boolean;
};

function Drawer({
  isOpen,
  children,
  className,
  onClose,
  position = "bottom",
  removeWhenClosed = true,
}: Props) {
  const bodyRef = useRef(document.querySelector("body"));
  const portalRootRef = useRef(
    document.getElementById("drawer-root") || createPortalRoot()
  );

  // Append portal root on mount
  useEffect(() => {
    bodyRef.current.appendChild(portalRootRef.current);
    const portal = portalRootRef.current;
    const bodyEl = bodyRef.current;

    return () => {
      // Clean up the portal when drawer component unmounts
      portal.remove();
      // Ensure scroll overflow is removed
      bodyEl.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const updatePageScroll = () => {
      if (isOpen) {
        bodyRef.current.style.overflow = "hidden";
      } else {
        bodyRef.current.style.overflow = "";
      }
    };

    updatePageScroll();
  }, [isOpen]);

  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keyup", onKeyPress);
    }

    return () => {
      window.removeEventListener("keyup", onKeyPress);
    };
  }, [isOpen, onClose]);

  const isTransitioning = useMountTransition(isOpen, 300);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden={isOpen ? "false" : "true"}
      className={cn("drawer-container", {
        open: isOpen,
        in: isTransitioning,
        className,
      })}
    >
      <div
        className={`drawer border border-black rounded-tl-[1.5rem] rounded-tr-[1.5rem] p-4 ${position}`}
        role="dialog"
      >
        <div className="w-full flex justify-end">
          <button type="button" onClick={() => onClose()} className="mt-2">
            Close
          </button>
        </div>
        {children}
      </div>
      {/* TODO: Move to top and align using flexbox to fill available space */}
      {/* Also remove position fixed */}
      <div className="backdrop" onClick={onClose} />
    </div>,
    portalRootRef.current
  );
}

export default Drawer;
