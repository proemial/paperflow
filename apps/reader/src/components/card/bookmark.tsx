"use client";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { bookmark } from "./card-actions";
import { Analytics } from "../analytics";
import { useUser } from "@auth0/nextjs-auth0/client";

type Props = {
  id: string;
  category: string;
  bookmarked?: boolean;
};

export function Bookmark({ id, category, bookmarked }: Props) {
  const [checked, setChecked] = useState(bookmarked);
  const { user } = useUser();
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
    <>
      {user && (
        <BookmarkIcon
          onClick={handleClick}
          className={checked ? "fill-foreground" : ""}
        />
      )}
      {!user && <BookmarkIcon className="stroke-zinc-700" />}
    </>
  );
}
