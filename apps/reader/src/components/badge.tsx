"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function Badge({ text }: { text: string }) {
  const [liked, setLiked] = useState(false);

  const borderStyle = liked ? "" : "border-primary";
  const textStyle = liked ? "bg-white" : "bg-black";
  const heartStyle = liked ? "fill-primary" : "";

  return (
    <div
      className={`${textStyle} ${borderStyle} text-purple-500 border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={() => setLiked(!liked)}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
