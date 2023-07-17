"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bookmark } from "lucide-react";
import { useState } from "react";

export function BookmarkButton({ id }: { id: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useUser();

  const handleClick = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <>
      {user && (
        <button type="button" onClick={handleClick}>
          <Bookmark className={`${bookmarked && "fill-foreground"}`} />
        </button>
      )}
      {!user && <Bookmark className="stroke-zinc-700" />}
    </>
  );
}
