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
  liked: boolean;
};

function updateLikes(req: LikesPostRequest) {
  return fetch("/api/user/likes", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function Badge({ id, category, text, liked: checked }: Props) {
  const { user } = useUser();
  const { mutate } = useMutation(updateLikes);

  const handleClick = () => {
    if (!user) {
      return;
    }
    const nowChecked = !checked;

    Analytics.track(nowChecked ? "click:like" : "click:like-clear", { id });

    mutate(
      { id, category, text, liked: nowChecked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["likes"]);
        },
      }
    );

    // Optimistic update of query cache
    queryClient.setQueryData(["likes"], (old: string[]) => {
      if (nowChecked) {
        return [...old, text];
      }
      return old.filter((todo) => todo !== text);
    });
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
      className={`${textStyle} ${borderStyle} ${cursorStyle} text-purple-500 border rounded-lg px-1 py-0 whitespace-nowrap flex items-center gap-1`}
      onClick={handleClick}
    >
      <Heart width={16} className={heartStyle} />
      {text}
    </div>
  );
}
