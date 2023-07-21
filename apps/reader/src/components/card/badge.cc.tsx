"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { LikesPostRequest } from "src/app/api/user/likes/route";
import { Analytics } from "../analytics";
import { queryClient } from "src/state/react-query";

type Props = {
  id: string;
  category: string;
  text: string;
  likes?: string[];
};

function updateLikes(req: LikesPostRequest) {
  return fetch("/api/user/likes", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function Badge({ id, category, text, likes }: Props) {
  const { user } = useUser();
  const { mutate } = useMutation(updateLikes);

  const checked = likes?.includes(text);

  const handleClick = () => {
    if (!user) {
      return;
    }

    Analytics.track(!checked ? "click:like" : "click:like-clear", { id });

    mutate(
      { id, category, text, liked: !checked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["likes"]);
        },
      }
    );
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
