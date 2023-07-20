"use client";
import React from "react";
import { useTransition } from "react";
import { clearBookmarks, clearLikes } from "./feed-actions";

export function ClearLikes({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearLikes());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear all ({count}) likes]
    </button>
  );
}

export function ClearBookmarks({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearBookmarks());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear all ({count}) bookmarks]
    </button>
  );
}
