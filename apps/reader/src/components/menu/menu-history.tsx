"use client";
import { History } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";

export const HistoryMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { user, goto, toggleDrawer, status, color } = useAuthActions();

      const handleClick = () => {
        if (status !== "member") return;

        user ? goto("/history") : toggleDrawer();
      };

      return (
        <button type="button" onClick={handleClick}>
          <History className={color} />
        </button>
      );
    }),
  { ssr: false }
);
