"use client";
import { Bookmark } from "lucide-react";
import { Button } from "src/components/shadcn-ui/button";
import { ShareButton } from "./share-button";

type Props = {
  id: string;
  className: string;
};

export function ActionsMenu({ id, className }: Props) {
  const handleClick = () => {
    window.location.href = `https://arxiv.org/abs/${id}`;
  };

  return (
    <div
      className={`${className} w-full flex justify-between items-center shadow`}
    >
      <Button onClick={() => handleClick()}>Read the full article</Button>
      <div className="flex gap-4">
        <Bookmark />
        <ShareButton />
      </div>
    </div>
  );
}
