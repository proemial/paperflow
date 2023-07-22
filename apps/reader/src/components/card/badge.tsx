"use client";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { like } from "src/components/card/card-actions";
import { Analytics } from "src/components/analytics";
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
    const nowChecked = !checked;
    Analytics.track(nowChecked ? "click:like" : "click:like-clear", {
      id,
    });

    // @ts-ignore
    startTransition(() => like(id, category, text, nowChecked));

    setChecked(nowChecked);
  };

  let textStyle = checked
    ? "bg-white text-primary text-shadow-purple3"
    : "bg-black text-primary-light text-shadow-purple2";

  // border-color: rgb(255,102,255,0.2);box-shadow: 0 0 4px rgb(255,102,255,0.2);
  let borderStyle = checked ? "h-[24px]" : "border-[rgb(255,102,255,0.3)]";

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
      className={`${textStyle} ${borderStyle} ${cursorStyle} border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={handleClick}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
