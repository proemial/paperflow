"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "../analytics";
import Markdown from "../markdown";

export function CardLink({ id, text }: { id: string; text: string }) {
  const pathname = usePathname();
  const getViewName = (path: string) => {
    if (path === "/") return "home";
    if (path.startsWith("/arxiv")) return "reader";
    return path.slice(1);
  };

  const handleClick = () => {
    Analytics.track(`click:read-${getViewName(pathname)}`, { id });
    window.location.href = `/arxiv/${id}`;
  };

  return (
    <button
      onClick={handleClick}
      className="text-left text-2xl text-shadow-glow"
    >
      <Markdown>{text}</Markdown>
    </button>
  );
}
