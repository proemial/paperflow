"use client";
import Link from "next/link";

export function CardLink({ id, children }: { id: string; children: string }) {
  return (
    // @ts-ignore
    <Link href={`/arxiv/${id}`}>{children}</Link>
  );
}
