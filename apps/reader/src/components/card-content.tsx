"use client";

import { Badge } from "./badge";
import Markdown from "./markdown";

type Props = {
  id: string;
  text: string;
  tags: string[];
};

export function CardContent({ id, text, tags }: Props) {
  const handleClick = () => {
    document.location.href = `/arxiv/${id}`;
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 pt-8 flex flex-col justify-end text-lg font-medium items-center "
    >
      <Markdown>{text}</Markdown>
      <div className="w-full pt-6 text-xs font-medium tracking-wider flex justify-begin gap-2 overflow-scroll no-scrollbar">
        {tags.map((tag, index) => (
          <Badge key={index} text={tag.slice(1)} />
        ))}
      </div>
    </div>
  );
}
