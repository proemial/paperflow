"use client";
import { User } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";

export const ProfileMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { goto, color } = useAuthActions();

      const handleBookmarks = () => {
        goto("/profile");
      };

      return (
        <button type="button" onClick={handleBookmarks}>
          <User className={color} />
        </button>
      );
    }),
  { ssr: false }
);
