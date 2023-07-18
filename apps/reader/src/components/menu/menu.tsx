"use client";
import { AuthMenuItem } from "./menu-auth";
import { BookmarksMenuItem } from "./menu-bookmarks";
import { HomeMenuItem } from "./menu-home";
import { HistoryMenuItem } from "./menu-history";

export function MainMenu() {
  return (
    <div
      className="flex justify-around"
      style={{ boxShadow: "0px -24px 0 rgba(0, 0, 0, 0.85)" }}
    >
      <HomeMenuItem />
      <HistoryMenuItem />
      <BookmarksMenuItem />
      <AuthMenuItem />
    </div>
  );
}
