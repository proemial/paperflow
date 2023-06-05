import Link from "next/link";

export function CardLink({
  id,
  title,
  link,
}: {
  id: string;
  title: string;
  link?: string;
}) {
  const url = link ? link : `/read/${id}`;

  return (
    <Link href={url} className="underline">
      {title}
    </Link>
  );
}
