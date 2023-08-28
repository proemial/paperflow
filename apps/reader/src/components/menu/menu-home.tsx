"use client";
import { Home } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";

export const HomeMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { goto, status, color } = useAuthActions();

      const handleHome = () => {
        if (status !== "member") return;

        close();
        goto("/?reload=true");
      };

      return (
        <>
          <button type="button" onClick={handleHome}>
            <Home className={color} />
          </button>
        </>
      );
    }),
  { ssr: false }
);
