"use client";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { bookmark } from "./card-actions";
import { Analytics } from "../analytics";

type Props = {
  id: string;
  category: string;
  bookmarked?: boolean;
};

export function Bookmark({ id, category, bookmarked }: Props) {
  const [checked, setChecked] = useState(bookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setChecked(!bookmarked);
    Analytics.track(!!bookmarked ? "click:bookmark-clear" : "click:bookmark", {
      id,
    });

    // @ts-ignore
    startTransition(() => bookmark(id, category, !bookmarked));
  };

  return (
    <BookmarkIcon
      onClick={handleClick}
      className={checked ? "fill-foreground" : ""}
    />
  );
}
