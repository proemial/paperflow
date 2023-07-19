"use client";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useTransition } from "react";
import { bookmark } from "./card-actions";
import { Analytics } from "../analytics";

type Props = {
  id: string;
  category: string;
  bookmarked?: boolean;
};

export function Bookmark({ id, category, bookmarked }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    Analytics.track(!!bookmarked ? "click:bookmark-clear" : "click:bookmark", {
      id,
    });

    // @ts-ignore
    startTransition(() => bookmark(id, category, !bookmarked));
  };

  return (
    <BookmarkIcon
      onClick={handleClick}
      className={bookmarked ? "fill-foreground" : ""}
    />
  );
}
