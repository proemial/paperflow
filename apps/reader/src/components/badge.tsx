"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function Badge({ text }: { text: string }) {
  const [liked, setLiked] = useState(false);

  let textStyle = liked
    ? "bg-white text-primary text-shadow-purple3"
    : "bg-black text-primary-light text-shadow-purple2";

  // border-color: rgb(255,102,255,0.2);box-shadow: 0 0 4px rgb(255,102,255,0.2);
  let borderStyle = liked ? "h-[24px]" : "border-[rgb(255,102,255,0.3)]";

  let heartStyle = liked ? "fill-primary" : "";
  let cursorStyle = "cursor-pointer";

  return (
    <div
      className={`${textStyle} ${borderStyle} border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={() => setLiked(!liked)}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
