"use client";
import { Button } from "src/components/shadcn-ui/button";

export function ArxivButton({ id }: { id: string }) {
  const handleClick = () => {
    window.location.href = `https://arxiv.org/abs/${id}`;
  };

  return <Button onClick={() => handleClick()}>Read the full article</Button>;
}
