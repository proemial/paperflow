"use client";
import { MenuItems } from "./menu-items";
import { Toaster } from "./shadcn-ui/Toaster";

export function Menu() {
  return (
    <>
      <MenuItems />
      <Toaster />
    </>
  );
}
