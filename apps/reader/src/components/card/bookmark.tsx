"use client";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useTransition } from "react";
import { bookmark } from "./bookmark.action";

type Props = {
  id: string;
  bookmarked?: boolean;
};

export function Bookmark({ id, bookmarked }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    console.log("bookmark", id, !bookmarked, `(${bookmarked})`);

    // @ts-ignore
    startTransition(() => bookmark(id, !bookmarked));
  };

  return (
    <BookmarkIcon
      onClick={handleClick}
      className={bookmarked ? "fill-foreground" : ""}
    />
  );
}
