"use client";
import { findPaper, useViewHistory } from "@/src/state/history";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bookmark } from "lucide-react";
import { useEffect } from "react";
import { Analytics } from "./analytics";
import { useDrawerState } from "./login/state";

export function BookmarkButton({ id }: { id: string }) {
  const toggleBookmark = useViewHistory((state) => state.toggleBookmark);
  const { user } = useUser();
  const paper = useHistory(id);
  const { open } = useDrawerState();

  const handleClick = () => {
    if (!user) {
      open();
      return;
    }

    Analytics.track(
      !!paper?.bookmarked ? "click:bookmark-clear" : "click:bookmark",
      { id }
    );
    toggleBookmark(user.sub, id);
  };

  const active = user && paper;

  return (
    <button type="button" onClick={handleClick}>
      <Bookmark className={`${!!paper?.bookmarked && "fill-foreground"}`} />
    </button>
  );
}

function useHistory(id: string) {
  const { getPaper, papers } = useViewHistory();
  const { user } = useUser();
  const paper = findPaper(papers, user?.sub, id);

  useEffect(() => {
    if (user && !paper) {
      getPaper(user.sub, id);
    }
  }, [paper, user]);

  return paper;
}
