"use client";
// https://letsbuildui.dev/articles/building-a-drawer-component-with-react-portals

import { useRef, useEffect } from "react";
import { cn } from "../shadcn-ui/utils";
import "src/styles/drawer.css";
import { createPortal } from "react-dom";
import useMountTransition from "../use-mount-transition";
import { X } from "lucide-react";

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
      className={cn("drawer-container h-full w-full", {
        open: isOpen,
        in: isTransitioning,
        className,
      })}
    >
      <div className="w-full h-full">
        <div
          className={`h-full flex flex-col drawer ${position}`}
          role="dialog"
        >
          <div className="backdrop flex-1" onClick={onClose} />
          <div
            className="h-fit p-4 border border-black rounded-tl-[1.5rem] rounded-tr-[1.5rem]"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="w-full flex justify-end absolute right-4 top-0 z-50">
              <button
                type="button"
                onClick={() => onClose()}
                className="mt-2 border rounded-xl bg-primary border-primary p-1"
              >
                <X className="h-4 w-4 stroke-[4]" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalRootRef.current
  );
}

export default Drawer;
