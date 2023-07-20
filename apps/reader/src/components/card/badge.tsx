"use client";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { like } from "./card-actions";
import { Analytics } from "../analytics";

type Props = {
  id: string;
  category: string;
  text: string;
  likes?: string[];
};

export function Badge({ id, category, text, likes }: Props) {
  const [checked, setChecked] = useState(likes?.includes(text));
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setChecked(!checked);
    Analytics.track(!!checked ? "click:like-clear" : "click:like", {
      id,
    });

    const updatedLikes = !!checked
      ? likes.filter((like) => like !== text)
      : [...(likes || []), text];

    // @ts-ignore
    startTransition(() => like(id, category, updatedLikes));
  };

  // return (
  //   <BookmarkIcon
  //     onClick={handleClick}
  //     className={bookmarked ? "fill-foreground" : ""}
  //   />
  // );
  const borderStyle = checked ? "" : "border-primary";
  const textStyle = checked ? "bg-white" : "bg-black";
  const heartStyle = checked ? "fill-primary" : "";

  return (
    <div
      className={`${textStyle} ${borderStyle} text-purple-500 border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1 cursor-pointer`}
      onClick={handleClick}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
