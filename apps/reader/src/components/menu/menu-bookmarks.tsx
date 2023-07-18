"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookmarksMenuItem() {
  const { push } = useRouter();
  const { user } = useUser();

  const handleBookmarks = () => {
    push("/bookmarks");
  };

  return (
    <>
      {user && (
        <button type="button" onClick={handleBookmarks}>
          <Bookmark className="stroke-muted-foreground" />
        </button>
      )}
      {!user && <Bookmark className="stroke-zinc-700" />}
    </>
  );
}
