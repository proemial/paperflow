"use client";
import { Heart } from "lucide-react";
import { Badge } from "../shadcn-ui/Badge";

export function HashBadges({ hashtags }: { hashtags: string[] }) {
  return (
    <>
      {hashtags.map((hash, i) => (
        <HashBadge key={i} text={hash} />
      ))}
    </>
  );
}

export function HashBadge({ text, heavy }: { text: string; heavy?: boolean }) {
  return (
    <Badge
      variant={heavy ? "secondary" : "outline"}
      className="text-slate-400 font-normal mr-1 mb-1 cursor-pointer hover:text-slate-600"
    >
      {text}
      <Heart size={12} className="ml-1" />
    </Badge>
  );
}
