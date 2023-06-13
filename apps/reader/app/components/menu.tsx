"use client";
import { Toaster } from "./shadcn-ui/Toaster";
import { ShareButton } from "./share-button";

export function Menu() {
  return (
    <>
    {/* border: none;
    padding: 0;
    height: 24px; */}
      <div className="flex justify-end p-2 h-full items-end">
        <ShareButton />
      </div>
      <Toaster />
    </>
  );
}
