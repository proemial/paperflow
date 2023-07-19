"use client";
import React from "react";
import { useTransition } from "react";
import { clearBookmarks, clearLikes } from "./feed-actions";

export function ClearLikes() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearLikes());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-purple-500">
      [Clear all likes]
    </button>
  );
}

export function ClearBookmarks() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearBookmarks());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-purple-500">
      [Clear all bookmarks]
    </button>
  );
}
