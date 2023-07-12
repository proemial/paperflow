"use client";
import Link from "next/link";

export function CardLink({ children }: { children: string }) {
  return (
    // @ts-ignore
    <Link href="/arxiv/2307.05473">{children}</Link>
  );
}
