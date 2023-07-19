"use client";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import { like } from "./card-actions";
import { Analytics } from "../analytics";

type Props = {
  id: string;
  text: string;
  likes?: string[];
};

export function Badge({ id, text, likes }: Props) {
  const [isPending, startTransition] = useTransition();

  const liked = likes?.includes(text);

  const handleClick = () => {
    Analytics.track(!!liked ? "click:like-clear" : "click:like", {
      id,
    });

    const updatedLikes = !!liked
      ? likes.filter((like) => like !== text)
      : [...(likes || []), text];
    console.log(`startTransition(() => like(${id}, ${updatedLikes}));`);

    // @ts-ignore
    startTransition(() => like(id, updatedLikes));
  };

  // return (
  //   <BookmarkIcon
  //     onClick={handleClick}
  //     className={bookmarked ? "fill-foreground" : ""}
  //   />
  // );
  const borderStyle = liked ? "" : "border-primary";
  const textStyle = liked ? "bg-white" : "bg-black";
  const heartStyle = liked ? "fill-primary" : "";

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
