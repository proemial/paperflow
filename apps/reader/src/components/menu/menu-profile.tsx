"use client";
import { User } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";

export const ProfileMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { user, goto, toggleDrawer, status, color } = useAuthActions();

      const handleBookmarks = () => {
        if (status !== "member") return;

        user ? goto("/profile") : toggleDrawer();
      };

      return (
        <button type="button" onClick={handleBookmarks}>
          <User className={color} />
        </button>
      );
    }),
  { ssr: false }
);
