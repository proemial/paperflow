"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawerState } from "../login/state";

export function BookmarksMenuItem() {
  const { push } = useRouter();
  const { user } = useUser();
  const { toggle } = useDrawerState();

  const handleBookmarks = () => {
    user ? push("/bookmarks") : toggle();
  };

  return (
    <button type="button" onClick={handleBookmarks}>
      <Bookmark className="stroke-muted-foreground" />
    </button>
  );
}
