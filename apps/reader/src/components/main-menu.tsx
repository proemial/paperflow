"use client";
import { Bookmark, Home, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function MainMenu() {
  const { push } = useRouter();

  const handleHome = () => {
    push("/");
  };

  return (
    <div
      className="flex justify-around"
      style={{ boxShadow: "0px -24px 0 rgba(0, 0, 0, 0.85)" }}
    >
      <button type="button" onClick={() => handleHome()}>
        <Home className="stroke-muted-foreground" />
      </button>
      <div>
        <Search className="stroke-zinc-700" />
      </div>
      <div>
        <Bookmark className="stroke-zinc-700" />
      </div>
      <div>
        <User className="stroke-zinc-700" />
      </div>
    </div>
  );
}
