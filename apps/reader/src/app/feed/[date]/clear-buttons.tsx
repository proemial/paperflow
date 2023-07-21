"use client";
import React from "react";
import { useTransition } from "react";
import {
  clearBookmarks,
  clearLikes,
  clearHistory,
  clearCache,
} from "./feed-actions";

export function ClearLikes({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearLikes());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear all likes ({count})]
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
      [Clear all bookmarks ({count})]
    </button>
  );
}

export function ClearHistory({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearHistory());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear your past ({count})]
    </button>
  );
}

export function ClearCache({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // @ts-ignore
    startTransition(() => clearCache());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear feed cache]
    </button>
  );
}
