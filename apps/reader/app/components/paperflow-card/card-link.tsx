"use client"

import Link from "next/link";
import { Analytics } from "../utils/AnalyticsClient";
import { CSSProperties } from "react";

export function CardLink({
  id,
  title,
  link,
  className,
}: {
  id: string;
  title: string;
  link?: string;
  className?: string;
}) {
  const url = link ? link : `/read/${id}`;

  const handleClick = () => {
    if(link)
      Analytics.track('go:arxiv', { path: link });
    else
      Analytics.track('go:reader', { path: id });
  };

  return (
    <Link href={url} onClick={handleClick} className={className || 'underline'}>
      {title}
    </Link>
  );
}
