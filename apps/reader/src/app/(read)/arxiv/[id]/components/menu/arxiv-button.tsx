"use client";
import { Analytics } from "src/components/analytics";
import { Button } from "src/components/shadcn-ui/button";

export function ArxivButton({ id }: { id: string }) {
  return (
    <a
      href={`https://arxiv.org/abs/${id}`}
      target="_blank"
      className="rounded-md bg-gradient-to-r from-primary to-primary-gradient text-primary-foreground hover:from-primary/90 hover:to-primary-gradient/90 text-base py-2 px-4 h-10 flex items-center"
    >
      Read the full article
    </a>
  );
}
