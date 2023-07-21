"use client";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { like } from "./card-actions";
import { Analytics } from "../analytics";
import { useUser } from "@auth0/nextjs-auth0/client";

type Props = {
  id: string;
  category: string;
  text: string;
  likes?: string[];
};

export function Badge({ id, category, text, likes }: Props) {
  const { user } = useUser();
  const [checked, setChecked] = useState(likes?.includes(text));
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!user) {
      return;
    }
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

  let textStyle = checked
    ? "bg-white text-purple-500"
    : "bg-black text-purple-500";
  let borderStyle = checked ? "" : "border-primary";
  let heartStyle = checked ? "fill-primary" : "";
  let cursorStyle = "cursor-pointer";

  if (!user) {
    textStyle = "bg-black text-zinc-600";
    heartStyle = "fill-zinc-600";
    borderStyle = "border-zinc-600";
    cursorStyle = "";
  }

  return (
    <div
      className={`${textStyle} ${borderStyle} ${cursorStyle} text-purple-500 border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={handleClick}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
