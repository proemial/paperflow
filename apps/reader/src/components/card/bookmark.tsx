"use client";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { bookmark } from "./card-actions";
import { Analytics } from "../analytics";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useDrawerState } from "../login/state";

type Props = {
  id: string;
  category: string;
  bookmarked?: boolean;
};

export function Bookmark({ id, category, bookmarked }: Props) {
  const [checked, setChecked] = useState(bookmarked);
  const { user } = useUser();
  const [, startTransition] = useTransition();
  const { open } = useDrawerState();

  const handleClick = () => {
    if (!user) {
      open();
      return;
    }
    setChecked(!bookmarked);
    Analytics.track(!!bookmarked ? "click:bookmark-clear" : "click:bookmark", {
      id,
    });

    startTransition(() => bookmark(id, category, !bookmarked));
  };

  return (
    <BookmarkIcon
      onClick={handleClick}
      className={checked ? "fill-foreground" : ""}
    />
  );
}
