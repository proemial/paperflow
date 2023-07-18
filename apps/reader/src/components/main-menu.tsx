"use client";
import { Bookmark, Home, Search, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthButton } from "./auth";
import { useUser } from "@auth0/nextjs-auth0/client";

export function MainMenu() {
  const { push } = useRouter();
  const { user } = useUser();
  const isHome = window.location.pathname === "/";

  const handleHome = () => {
    push("/");
  };

  return (
    <div
      className="flex justify-around"
      style={{ boxShadow: "0px -24px 0 rgba(0, 0, 0, 0.85)" }}
    >
      {user && (
        <button type="button" onClick={() => handleHome()}>
          <Home className="stroke-muted-foreground" />
        </button>
      )}
      {!user && <Home className="stroke-zinc-700" />}
      <div>
        <Search className="stroke-zinc-700" />
      </div>
      <div>
        <Bookmark className="stroke-zinc-700" />
      </div>
      {(user || !isHome) && (
        <div>
          {/* <User className="stroke-zinc-700" /> */}
          <AuthButton user={user} />
        </div>
      )}
      {!user && isHome && <LogIn className="stroke-zinc-700" />}
    </div>
  );
}
