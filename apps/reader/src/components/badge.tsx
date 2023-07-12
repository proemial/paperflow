"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function Badge({ text }: { text: string }) {
  const [liked, setLiked] = useState(false);

  const textStyle = liked ? "bg-white text-black" : "bg-black";
  const heartStyle = liked ? "fill-black" : "";

  return (
    <div
      className={`${textStyle} border rounded-lg px-2 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={() => setLiked(!liked)}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
