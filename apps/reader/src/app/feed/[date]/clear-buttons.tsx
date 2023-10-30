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
  const [, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => clearLikes());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear all likes ({count})]
    </button>
  );
}

export function ClearBookmarks({ count }: { count: number }) {
  const [, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => clearBookmarks());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear all bookmarks ({count})]
    </button>
  );
}

export function ClearHistory({ count }: { count: number }) {
  const [, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => clearHistory());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear your past ({count})]
    </button>
  );
}

export function ClearCache() {
  const [, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => clearCache());
  };

  return (
    <button onClick={handleClick} className="ml-2 text-sm text-secondary">
      [Clear feed cache]
    </button>
  );
}
