"use client";
import { Home } from "lucide-react";
import { useAuthActions } from "../authentication";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

export const HomeMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { push } = useRouter();
      const { isHome, color } = useAuthActions();

      const handleHome = () => {
        if (isHome) return;

        close();
        push("/?reload=true");
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
