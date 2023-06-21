"use client";
import Link from "next/link";
import { Toaster } from "./shadcn-ui/Toaster";
import { ShareButton } from "./share-button";
import Image from "next/image";

export function Menu() {
  return (
    <>
      {/* border: none;
    padding: 0;
    height: 24px; */}
      <div className="flex p-2 h-full items-end justify-between md:flex-col">
        <Link href="/">
          <Image src="/logo.png" height={40} width={40} alt="" />
        </Link>
        <ShareButton />
      </div>
      <Toaster />
    </>
  );
}
