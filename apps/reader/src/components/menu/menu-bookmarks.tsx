"use client";
import { Bookmark } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";

export const BookmarksMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { user, goto, toggleDrawer, status, color } = useAuthActions();

      const handleBookmarks = () => {
        if (status !== "member") return;

        user ? goto("/bookmarks") : toggleDrawer();
      };

      return (
        <button type="button" onClick={handleBookmarks}>
          <Bookmark className={color} />
        </button>
      );
    }),
  { ssr: false }
);
